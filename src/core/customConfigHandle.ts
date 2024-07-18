import { writeFile, copyFile } from 'fs/promises'
import { resolve, basename } from 'path'
import { isAvailableDir } from 'src/file'
import { PackError } from 'src/base/error'
import { handleCommand } from 'src/command'
import { GENERATE_ENV_ERROR, GENERATE_SPLASH_ERROR } from 'src/const'
import { packConfig } from 'src/base/handleConfig'
import { spinner } from 'src/base/spinner'

/**
 * 处理 打包时的 env文件
 */
async function handleEnvFile(yarnCommandDir: string) {
	const envContent = `
  APP_NAME=${packConfig.name || 'H5Pack'}
  `
	try {
		await writeFile(resolve(yarnCommandDir, '.env'), envContent, 'utf-8')
	} catch (error: any) {
		throw new PackError(
			GENERATE_ENV_ERROR,
			error.message || 'write env file error'
		)
	}
}

/**
 * 处理启动页图片
 */
async function handleSplash(yarnCommandDir: string) {
	if (!packConfig.splash) {
		return
	}
	try {
		const fileName = basename(packConfig.splash)
		const splashPath = resolve(process.cwd(), packConfig.splash)
		const goalPath = resolve(yarnCommandDir, `./public/splash/${fileName}`)
		if (isAvailableDir(splashPath)) {
			await copyFile(splashPath, goalPath)
			await handleCommand(
				yarnCommandDir,
				'yarn',
				[
					'react-native',
					'generate-bootsplash',
					resolve(yarnCommandDir, `./public/splash/${fileName}`),
					'--platforms=android',
				],
				originErrorMessage => {
					throw new Error(originErrorMessage)
				}
			)
		} else {
			throw new Error(`packConfig.splash is not a available path`)
		}
	} catch (error: any) {
		throw new PackError(GENERATE_SPLASH_ERROR, error.message)
	}
}

export async function handleCustomConfig(yarnCommandDir: string) {
	await handleEnvFile(yarnCommandDir)
	await handleSplash(yarnCommandDir)
	spinner.stop()
	spinner.succeed('✅ Custom Config Success')
}
