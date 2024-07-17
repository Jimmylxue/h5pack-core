import { TPackConfig } from 'src/types/type'
// import { AndroidRepositories } from 'src/const'
import { promises } from 'fs'
import { join, resolve } from 'path'
import { copyFilesByDir, isAvailableDir } from 'src/file'
import { handleCommand } from 'src/command'
import { handleCustomConfig } from './customConfigHandle'

/**
 * 打包完成后的操作
 */
async function buildSuccessHandle(rootDir: string) {
	await promises.copyFile(
		join(
			rootDir,
			'./h5pack-native/android/app/build/outputs/apk/release/app-release.apk'
		),
		'app-release.apk'
	)
}

export async function processAndroid(packConfig: TPackConfig, rootDir: string) {
	console.log('rootDir', rootDir)

	const yarnCommandDir = join(rootDir, './h5pack-native')

	// 克隆仓库
	// await handleCommand(rootDir, 'git', [
	// 	'clone',
	// 	AndroidRepositories,
	// 	yarnCommandDir,
	// ])

	/**
	 * 复制打包资源
	 */
	const entryPath = resolve(process.cwd(), packConfig.entry)
	const isAvailablePath = isAvailableDir(entryPath)
	if (!isAvailablePath) {
		console.error('路径不正确，请检查配置')
	}
	const goalPath = join(rootDir, './h5pack-native/public/webview/dist')
	await copyFilesByDir(entryPath, goalPath)

	/**
	 * 安装依赖
	 */
	// await handleCommand(yarnCommandDir, 'yarn')

	/**
	 * 处理个性化配置
	 */
	await handleCustomConfig(packConfig, yarnCommandDir)

	/**
	 * 打包
	 */
	await handleCommand(yarnCommandDir, 'yarn', ['release'])

	/**
	 * 打包完成的系列操作
	 */
	await buildSuccessHandle(rootDir)
	console.log('打包完成')
}
