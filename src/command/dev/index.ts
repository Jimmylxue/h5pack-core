import { spinner } from 'src/base/spinner'
import { join, resolve, dirname, relative } from 'path'
import { isAvailableDir } from 'src/file'
import { handleCommand } from 'src/command'
import chalk from 'chalk'
import {
	AndroidRepositories,
	COPY_BUILD_SOURCE_ERROR,
	GIT_CLONE_ERROR,
	YARN_INSTALL_ERROR,
} from 'src/const'
import { packConfig } from 'src/base/handleConfig'
import { PackError } from 'src/base/error'
import { copyBuildSource } from 'src/core/native'
import { watch, existsSync, mkdirSync, copyFileSync, unlinkSync } from 'fs'
import {
	handleDevCustomConfig,
	handleEnvFile,
	handleServerMode,
	handleStartLocal,
} from 'src/core/customConfigHandle'

function syncOne(rootDir: string, changedAbsPath: string, entryAbs: string) {
	const rel = relative(entryAbs, changedAbsPath)
	const destRoot = join(rootDir, './h5pack-native/public/webview/dist')
	const dest = join(destRoot, rel)
	const dir = dirname(dest)
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
	if (existsSync(changedAbsPath)) {
		copyFileSync(changedAbsPath, dest)
	} else {
		if (existsSync(dest)) unlinkSync(dest)
	}
}

function watchFile(rootDir: string) {
	const entryPath = resolve(process.cwd(), packConfig.entry)
	if (isAvailableDir(entryPath)) {
		console.log(chalk.cyan(`👀 Watching for changes in ${entryPath} ......`))
		watch(entryPath, { recursive: true }, (_, filename) => {
			if (!filename) return
			const changedAbs = resolve(entryPath, filename)
			try {
				console.log(chalk.yellow(`🔄  Syncing change ${changedAbs} ......`))
				syncOne(rootDir, changedAbs, entryPath)
				console.log(chalk.green('✅ Sync success!'))
			} catch (e: any) {
				console.log(chalk.red(`❌ Sync failed: ${e.message || e}`))
			}
		})
	}
}

/**
 * dev 指令执行的操作
 */
export async function processAndroidDev(
	rootDir: string,
	options: {
		watch: boolean
		start: boolean
		devPort?: number
		reversePort?: number
	},
) {
	const yarnCommandDir = join(rootDir, './h5pack-native')
	console.log(chalk.cyan('🚩 Prepare Native Source (Dev) ......'))
	// 如果不存在则克隆仓库
	if (!isAvailableDir(yarnCommandDir)) {
		await handleCommand(
			rootDir,
			'git',
			['clone', AndroidRepositories[packConfig.registry], yarnCommandDir],
			originErrorMessage => {
				console.log(chalk.red(`❌ Download failed: ${originErrorMessage}`))
				throw new PackError(GIT_CLONE_ERROR, originErrorMessage)
			},
		)
		console.log(chalk.green('✅ download success!'))
	} else {
		console.log(chalk.cyan('✅ use local h5pack-native ......'))
	}

	/**
	 * 安装依赖
	 */
	await handleCommand(yarnCommandDir, 'yarn', [], originErrorMessage => {
		spinner.stop()
		throw new PackError(YARN_INSTALL_ERROR, originErrorMessage)
	})

	/**
	 * 是否开启 Server 模式，开启后会开启本地 Server 并注入 DEV 环境变量
	 */
	const isServerMode = options.devPort || options.reversePort

	if (isServerMode) {
		if (options.devPort) {
			console.log(
				chalk.cyan(
					`⚙️  Inject DEV env: APP_WEBVIEW_DEV_ENABLED=true, PORT=${options.devPort}`,
				),
			)
		}

		if (options.reversePort) {
			console.log(
				chalk.cyan(
					`🔁 adb reverse tcp:${options.reversePort} -> host tcp:${options.reversePort}`,
				),
			)
			await handleCommand(
				process.cwd(),
				'adb',
				['reverse', `tcp:${options.reversePort}`, `tcp:${options.reversePort}`],
				originErrorMessage => {
					console.log(chalk.red(`❌ adb reverse failed: ${originErrorMessage}`))
				},
			)
		}

		await handleServerMode(yarnCommandDir)
	} else {
		// 拷贝 H5 资源
		await copyBuildSource(rootDir, originErrorMessage => {
			throw new PackError(COPY_BUILD_SOURCE_ERROR, originErrorMessage)
		})

		if (options.watch) {
			watchFile(rootDir)
		}

		if (options.start) {
			console.log(chalk.cyan('🚩 Start Local Server ......'))
			await handleStartLocal(yarnCommandDir)
		}
	}

	// 仅处理启动页与图标
	spinner.start('🚩 Handle Dev Custom Config ......')
	await handleDevCustomConfig(yarnCommandDir)
	spinner.succeed('✅ Handle Success!')

	// 安装依赖，便于在本地 Android Studio 或 yarn android 调试
	spinner.start('🚩 Install Dependencies ......')
	await handleCommand(yarnCommandDir, 'yarn', [], originErrorMessage => {
		spinner.stop()
		throw new PackError(YARN_INSTALL_ERROR, originErrorMessage)
	})
	spinner.succeed('✅ Dependencies Installed!')

	spinner.succeed(
		'🎉 Dev project is ready. Open h5pack-native/android in Android Studio or cd h5pack-native && run yarn dev:android:local',
	)
}
