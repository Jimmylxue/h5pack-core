import { exec } from 'child_process'
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

export async function doctor() {
	console.log(chalk.bold.blue('\n🏥 h5pack Environment Doctor\n'))

	const checks = [
		{ name: 'Node.js', command: 'node -v', required: true },
		{ name: 'Git', command: 'git --version', required: true },
		{
			name: 'Java (JDK)',
			command: 'javac -version',
			required: true,
			hint: 'Install JDK 11+ and set JAVA_HOME.',
		},
		{
			name: 'Android SDK (adb)',
			command: 'adb version',
			required: false,
			hint: 'Add Android SDK platform-tools to PATH.',
		},
	]

	let hasError = false

	for (const check of checks) {
		const spinner = ora(`Checking ${check.name}...`).start()
		try {
			const output = await run(check.command)
			const version = output.trim().split('\n')[0]
			spinner.succeed(`${check.name}: ${chalk.green(version)}`)
		} catch (error: any) {
			spinner.fail(`${check.name} check failed`)
			if (check.required) {
				hasError = true
				console.log(chalk.red(`   Error: ${error}`))
				if ((check as any).hint) {
					console.log(chalk.yellow(`   Hint: ${(check as any).hint}`))
				}
			} else {
				console.log(chalk.gray(`   Warning: ${error}`))
				if ((check as any).hint) {
					console.log(chalk.gray(`   Hint: ${(check as any).hint}`))
				}
			}
		}
	}

	const envVars = ['JAVA_HOME', 'ANDROID_HOME']
	console.log(chalk.bold.blue('\nEnvironment Variables:'))
	for (const envVar of envVars) {
		if (process.env[envVar]) {
			console.log(`✅ ${envVar} = ${process.env[envVar]}`)
		} else {
			console.log(`❌ ${envVar} is not set`)
			if (envVar === 'ANDROID_HOME' || envVar === 'JAVA_HOME') {
				hasError = true
			}
		}
	}

	console.log('\n')
	if (hasError) {
		console.log(chalk.red('❌ Missing environment requirements.'))
		process.exit(1)
	} else {
		console.log(chalk.green('✅ Environment looks good'))
	}
}
