import { exec } from 'child_process'
import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import ora from 'ora'
import chalk from 'chalk'

function run(command: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(stderr || error.message)
			} else {
				resolve(stdout || stderr)
			}
		})
	})
}

interface ToolCheck {
	name: string
	command: string
	required: boolean
	hint?: string
	/** 给定 stderr/error，返回更精准的诊断信息 */
	diagnose?: (stderr: string) => string | undefined
}

interface EnvCheck {
	name: string
	required: boolean
	hint?: string
	alias?: string // ANDROID_HOME alias for ANDROID_SDK_ROOT
}

function resolveSdkRoot(): string | undefined {
	return process.env['ANDROID_SDK_ROOT'] || process.env['ANDROID_HOME']
}

async function checkLicenses(sdkRoot: string): Promise<{ ok: boolean; message: string }> {
	const licensesDir = join(sdkRoot, 'licenses')
	if (!existsSync(licensesDir)) {
		return { ok: false, message: 'licenses directory not found' }
	}
	const files = readdirSync(licensesDir)
	if (files.length === 0) {
		return { ok: false, message: 'no license files found' }
	}
	return { ok: true, message: `${files.length} license file(s) accepted` }
}

export async function doctor() {
	console.log(chalk.bold.blue('\n🏥 h5pack Environment Doctor\n'))

	// ── Tool / CLI checks ──
	const toolChecks: ToolCheck[] = [
		{ name: 'Node.js', command: 'node -v', required: true },
		{ name: 'Git', command: 'git --version', required: true },
		{
			name: 'Java (JDK)',
			command: 'javac -version',
			required: true,
			hint: 'Install JDK 17+ and set JAVA_HOME.\n   macOS: brew install openjdk@17\n   Windows: https://adoptium.net/',
		},
		{
			name: 'Yarn',
			command: 'yarn -v',
			required: true,
			hint: 'Install Yarn: npm install -g yarn\n   国内加速: npm install -g yarn --registry=https://registry.npmmirror.com',
		},
		{
			name: 'Android SDK (adb)',
			command: 'adb version',
			required: false,
			hint: 'Add Android SDK platform-tools to PATH.\n   export PATH=$PATH:$ANDROID_HOME/platform-tools',
		},
		{
			name: 'sdkmanager',
			command: 'sdkmanager --version',
			required: false,
			hint: 'sdkmanager not found. Install Android SDK Command-line Tools:\n   Android Studio → Settings → SDK Manager → SDK Tools → Android SDK Command-line Tools\n   或手动下载: https://developer.android.com/studio#command-tools\n   国内镜像参考: https://mirrors.cloud.tencent.com/AndroidSDK/',
			diagnose(stderr) {
				if (stderr.includes('javax/xml/bind') || stderr.includes('NoClassDefFoundError')) {
					return 'sdkmanager is installed but incompatible with current JDK (requires JDK 8~11).\n   This does NOT affect h5pack builds — only the sdkmanager CLI is broken.\n   Fix options:\n   1. Upgrade Command-line Tools to latest (recommended)\n   2. Or set JAVA_HOME to JDK 11 when running sdkmanager'
				}
				if (stderr.includes('java.lang.UnsupportedClassVersionError')) {
					return 'sdkmanager binary is too old for your JDK. Upgrade Android SDK Command-line Tools.'
				}
				return undefined
			},
		},
	]

	let hasError = false

	for (const check of toolChecks) {
		const spinner = ora(`Checking ${check.name}...`).start()
		try {
			const output = await run(check.command)
			const version = output.trim().split('\n')[0]
			spinner.succeed(`${check.name}: ${chalk.green(version)}`)
		} catch (error: any) {
			const stderr = typeof error === 'string' ? error : error?.message || String(error)
			const diagnosis = check.diagnose?.(stderr)

			spinner.fail(`${check.name} check failed`)
			if (diagnosis) {
				// 精准诊断：命令存在但有问题，不算致命错误
				console.log(chalk.yellow(`   ⚠️  ${diagnosis}`))
			} else if (check.required) {
				hasError = true
				console.log(chalk.red(`   Error: ${stderr}`))
				if (check.hint) {
					console.log(chalk.yellow(`   Hint: ${check.hint}`))
				}
			} else {
				console.log(chalk.gray(`   Warning: ${stderr}`))
				if (check.hint) {
					console.log(chalk.gray(`   Hint: ${check.hint}`))
				}
			}
		}
	}

	// ── Environment variable checks ──
	const envChecks: EnvCheck[] = [
		{ name: 'JAVA_HOME', required: true, hint: 'Set JAVA_HOME to your JDK installation directory.\n   export JAVA_HOME=$(/usr/libexec/java_home)' },
		{ name: 'ANDROID_HOME', required: true, hint: 'Set ANDROID_HOME to your Android SDK path.\n   export ANDROID_HOME=$HOME/Library/Android/sdk  (macOS)\n   export ANDROID_HOME=$HOME/Android/Sdk          (Linux)' },
		{ name: 'ANDROID_SDK_ROOT', required: false, hint: 'ANDROID_SDK_ROOT is optional if ANDROID_HOME is set.\n   Some tools prefer ANDROID_SDK_ROOT — consider setting both:\n   export ANDROID_SDK_ROOT=$ANDROID_HOME', alias: 'ANDROID_HOME' },
	]

	console.log(chalk.bold.blue('\n📋 Environment Variables:'))
	for (const envCheck of envChecks) {
		const value = process.env[envCheck.name]
		// For ANDROID_SDK_ROOT, also accept ANDROID_HOME as a fallback
		const effectiveValue = value || (envCheck.alias ? process.env[envCheck.alias] : undefined)
		const fromAlias = !value && envCheck.alias && process.env[envCheck.alias]

		if (effectiveValue) {
			const suffix = fromAlias ? chalk.gray(` (via ${envCheck.alias})`) : ''
			console.log(`   ✅ ${envCheck.name} = ${effectiveValue}${suffix}`)
		} else {
			if (envCheck.required) {
				hasError = true
				console.log(chalk.red(`   ❌ ${envCheck.name} is not set`))
			} else {
				console.log(chalk.gray(`   ⚠️  ${envCheck.name} is not set`))
			}
			if (envCheck.hint) {
				console.log(chalk.yellow(`      Hint: ${envCheck.hint}`))
			}
		}
	}

	// ── Android SDK license check ──
	console.log(chalk.bold.blue('\n📜 Android SDK Licenses:'))
	const sdkRoot = resolveSdkRoot()
	if (sdkRoot) {
		const spinner = ora('Checking licenses...').start()
		const licenseResult = await checkLicenses(sdkRoot)
		if (licenseResult.ok) {
			spinner.succeed(`Licenses: ${chalk.green(licenseResult.message)}`)
		} else {
			spinner.fail(`Licenses: ${chalk.red(licenseResult.message)}`)
			hasError = true
			console.log(chalk.yellow('   Hint: Accept licenses by running:'))
			console.log(chalk.yellow(`   sdkmanager --licenses --sdk_root="${sdkRoot}"`))
			console.log(chalk.gray('   国内网络: 如下载缓慢，可配置代理或使用国内镜像'))
			console.log(chalk.gray('   export ANDROID_SDK_ROOT=https://mirrors.cloud.tencent.com/AndroidSDK/'))
		}
	} else {
		console.log(chalk.gray('   ⏭️  Skipped (ANDROID_HOME / ANDROID_SDK_ROOT not set)'))
	}

	// ── Network tips for China users ──
	console.log(chalk.bold.blue('\n🌐 国内网络加速提示:'))
	console.log(chalk.gray('   Android SDK 下载慢？可配置镜像源:'))
	console.log(chalk.gray('   1. Android Studio → Settings → HTTP Proxy → 手动代理配置'))
	console.log(chalk.gray('   2. sdkmanager --proxy=http --proxy_host=mirrors.cloud.tencent.com --proxy_port=80'))
	console.log(chalk.gray('   3. npm/yarn 国内源: npm config set registry https://registry.npmmirror.com'))

	// ── Final verdict ──
	console.log('\n')
	if (hasError) {
		console.log(chalk.red('❌ Missing environment requirements. Please fix the issues above.'))
		process.exit(1)
	} else {
		console.log(chalk.green('✅ Environment looks good! You are ready to build.'))
	}
}
