import {
	AndroidRepositories,
	BUILD_APP_ERROR,
	BUILD_SUCCESS_CALLBACK_ERROR,
	COPY_BUILD_SOURCE_ERROR,
	GIT_CLONE_ERROR,
} from 'src/const'
import { promises } from 'fs'
import { join, resolve } from 'path'
import { copyFilesByDir, isAvailableDir } from 'src/file'
import { handleCommand } from 'src/command'
import { handleCustomConfig } from './customConfigHandle'
import { PackError } from 'src/base/error'
import { spinner } from 'src/base/spinner'
import { packConfig } from 'src/base/handleConfig'
import { handleNativePermission } from './permission'
import { YARN_INSTALL_ERROR } from 'src/const'
/**
 * 打包完成后的操作
 */
async function buildSuccessHandle(
	rootDir: string,
	errorHandle: (originErrorMessage: string) => void
) {
	try {
		const outputPath = resolve(process.cwd(), packConfig.output || './')
		const isAvailablePath = isAvailableDir(outputPath)
		if (!isAvailablePath) {
			throw new Error('packConfig.output is not a available path')
		}
		const isAab = packConfig.buildFormat === 'aab'
		const originPath = isAab
			? join(
					rootDir,
					'./h5pack-native/android/app/build/outputs/bundle/release/app-release.aab'
			  )
			: join(
					rootDir,
					'./h5pack-native/android/app/build/outputs/apk/release/app-release.apk'
			  )
		const goalName = isAab ? 'app-release.aab' : 'app-release.apk'
		await promises.copyFile(originPath, resolve(outputPath, goalName))
	} catch (error: any) {
		errorHandle(error.message || 'packConfig.output is not a available path')
	}
}

/**
 * 复制打包资源
 */
async function copyBuildSource(
	rootDir: string,
	errorHandle: (originErrorMessage: string) => void
) {
	try {
		const entryPath = resolve(process.cwd(), packConfig.entry)
		const isAvailablePath = isAvailableDir(entryPath)
		if (!isAvailablePath) {
			errorHandle('packConfig.entry is not a available path')
			return
		}
		const goalPath = join(rootDir, './h5pack-native/public/webview/dist')
		await copyFilesByDir(entryPath, goalPath)
	} catch (error: any) {
		errorHandle(error.message || 'packConfig.entry is not a available path')
	}
}

export async function processAndroid(rootDir: string) {
	const yarnCommandDir = join(rootDir, './h5pack-native')
	spinner.start('🚩 Download Source ......')
	// 克隆仓库
	await handleCommand(
		rootDir,
		'git',
		['clone', AndroidRepositories[packConfig.registry], yarnCommandDir],
		originErrorMessage => {
			spinner.stop()
			throw new PackError(GIT_CLONE_ERROR, originErrorMessage)
		}
	)

	spinner.succeed('✅ download success!')

	await copyBuildSource(rootDir, originErrorMessage => {
		throw new PackError(COPY_BUILD_SOURCE_ERROR, originErrorMessage)
	})

	spinner.start('🚩 Handle Custom Permission ......')
	await handleNativePermission(rootDir)

	spinner.start('🚩 Install Dependencies ......')
	/**
	 * 安装依赖
	 */
	await handleCommand(yarnCommandDir, 'yarn', [], originErrorMessage => {
		spinner.stop()
		throw new PackError(YARN_INSTALL_ERROR, originErrorMessage)
	})

	spinner.succeed('✅ Dependencies Installed!')

	spinner.start('🚩 Handle Custom Config ......')
	/**
	 * 处理个性化配置
	 */
	await handleCustomConfig(yarnCommandDir)
	spinner.succeed('✅ Handle Success!')

	spinner.start('😊 Building App ......')
	/**
	 * 打包
	 */
	const isAab = packConfig.buildFormat === 'aab'
	const releaseCommand = isAab ? 'release:aab' : 'release'
	await handleCommand(
		yarnCommandDir,
		'yarn',
		[releaseCommand],
		originErrorMessage => {
			spinner.stop()
			throw new PackError(BUILD_APP_ERROR, originErrorMessage)
		}
	)
	spinner.stop()
	spinner.start('✅ building Success ......')

	spinner.start('😊 Generate Apk ......')
	/**
	 * 打包完成的系列操作
	 */
	await buildSuccessHandle(rootDir, originErrorMessage => {
		throw new PackError(BUILD_SUCCESS_CALLBACK_ERROR, originErrorMessage)
	})

	spinner.stop()
	spinner.succeed('🎉 Packaging completed !!! 🎉')
}
