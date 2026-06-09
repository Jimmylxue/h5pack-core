import {
	AndroidRepositories,
	BUILD_APP_ERROR,
	BUILD_SUCCESS_CALLBACK_ERROR,
	COPY_BUILD_SOURCE_ERROR,
	GIT_CLONE_ERROR,
} from 'src/const'
import { promises } from 'fs'
import { join, resolve, extname } from 'path'
import { copyFilesByDir, isAvailableDir, removeDir } from 'src/file'
import { handleCommand } from 'src/command'
import { handleCustomConfig } from './customConfigHandle'
import { PackError } from 'src/base/error'
import { spinner } from 'src/base/spinner'
import { packConfig } from 'src/base/handleConfig'
import { handleNativePermission } from './permission'
import { YARN_INSTALL_ERROR } from 'src/const'

/**
 * 重写 HTML 中的绝对路径为相对路径，避免运行时字符串替换
 */
async function rewriteHtmlPaths(dir: string) {
	const entries = await promises.readdir(dir, { withFileTypes: true })
	for (const entry of entries) {
		const fullPath = join(dir, entry.name)
		if (entry.isDirectory()) {
			await rewriteHtmlPaths(fullPath)
		} else if (extname(entry.name) === '.html') {
			let content = await promises.readFile(fullPath, 'utf-8')
			content = content
				.replace(/(src|href)=["']\/(assets\/[^"']+)["']/g, '$1="$2"')
				.replace(/url\(["']?\/(assets\/[^"')]+)["']?\)/g, 'url("$1")')
			await promises.writeFile(fullPath, content, 'utf-8')
		}
	}
}
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
export async function copyBuildSource(
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
		// 构建时预处理 HTML 路径，避免运行时字符串替换
		await rewriteHtmlPaths(goalPath)
	} catch (error: any) {
		errorHandle(error.message || 'packConfig.entry is not a available path')
	}
}

export async function processAndroid(rootDir: string) {
	const yarnCommandDir = join(rootDir, './h5pack-native')
	const useCache = packConfig.cache && isAvailableDir(yarnCommandDir)

	if (!useCache) {
		// 非缓存模式：清理可能残留的目录（上次 Ctrl+C 或异常退出时未完成清理）
		if (isAvailableDir(yarnCommandDir)) {
			await removeDir(yarnCommandDir, true)
		}

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
	} else {
		spinner.succeed('✅ Using cached native project!')
		spinner.warn(
			'⚠️  Cache mode enabled — using existing native project. If you encounter build issues, set "cache": false in h5pack.json and retry.'
		)
	}

	spinner.start('🚩 Install Dependencies ......')
	/**
	 * 安装依赖 - 即使使用缓存也执行，yarn 会自动跳过已安装的包，速度很快
	 * 同时可以修复上次安装被中断导致的 node_modules 不完整问题
	 */
	await handleCommand(yarnCommandDir, 'yarn', [], originErrorMessage => {
		spinner.stop()
		throw new PackError(YARN_INSTALL_ERROR, originErrorMessage)
	})

	spinner.succeed('✅ Dependencies Installed!')

	await copyBuildSource(rootDir, originErrorMessage => {
		throw new PackError(COPY_BUILD_SOURCE_ERROR, originErrorMessage)
	})

	spinner.start('🚩 Handle Custom Permission ......')
	await handleNativePermission(rootDir)

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
