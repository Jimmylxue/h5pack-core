import { TPackConfig } from 'src/types/type'
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

/**
 * 打包完成后的操作
 */
async function buildSuccessHandle(
	packConfig: TPackConfig,
	rootDir: string,
	errorHandle: (originErrorMessage: string) => void
) {
	try {
		const outputPath = resolve(process.cwd(), packConfig.output || './')
		const isAvailablePath = isAvailableDir(outputPath)
		if (!isAvailablePath) {
			throw new Error('packConfig.entry is not a available path')
		}
		await promises.copyFile(
			join(
				rootDir,
				'./h5pack-native/android/app/build/outputs/apk/release/app-release.apk'
			),
			outputPath
		)
	} catch (error: any) {
		errorHandle(error.message || 'packConfig.output is not a available path')
	}
}

/**
 * 复制打包资源
 */
async function copyBuildSource(
	packConfig: TPackConfig,
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

export async function processAndroid(packConfig: TPackConfig, rootDir: string) {
	const yarnCommandDir = join(rootDir, './h5pack-native')

	// 克隆仓库
	await handleCommand(
		rootDir,
		'git',
		['clone', AndroidRepositories, yarnCommandDir],
		originErrorMessage => {
			throw new PackError(GIT_CLONE_ERROR, originErrorMessage)
		}
	)

	await copyBuildSource(packConfig, rootDir, originErrorMessage => {
		throw new PackError(COPY_BUILD_SOURCE_ERROR, originErrorMessage)
	})

	/**
	 * 安装依赖
	 */
	await handleCommand(yarnCommandDir, 'yarn', [], originErrorMessage => {
		throw new PackError(GIT_CLONE_ERROR, originErrorMessage)
	})

	/**
	 * 处理个性化配置
	 */
	await handleCustomConfig(packConfig, yarnCommandDir)

	/**
	 * 打包
	 */
	await handleCommand(
		yarnCommandDir,
		'yarn',
		['release'],
		originErrorMessage => {
			throw new PackError(BUILD_APP_ERROR, originErrorMessage)
		}
	)

	/**
	 * 打包完成的系列操作
	 */
	await buildSuccessHandle(packConfig, rootDir, originErrorMessage => {
		throw new PackError(BUILD_SUCCESS_CALLBACK_ERROR, originErrorMessage)
	})
	console.log('打包完成')
}
