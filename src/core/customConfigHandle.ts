import { writeFile, copyFile } from 'fs/promises'
import { resolve, basename, join } from 'path'
import { isAvailableDir } from 'src/file'
import { PackError } from 'src/base/error'
import { handleCommand } from 'src/command'
import {
	GENERATE_APP_LOGO_ERROR,
	GENERATE_ENV_ERROR,
	GENERATE_SPLASH_ERROR,
	SIGNING_CONFIG_ERROR,
} from 'src/const'
import { packConfig } from 'src/base/handleConfig'
import { spinner } from 'src/base/spinner'
import { readFile, writeFile as writeFileFs } from 'fs/promises'
import { handleSigning } from './sign/inex'

/**
 * 处理 打包时的 env文件
 */
async function handleEnvFile(yarnCommandDir: string) {
	const envContent = `
  APP_NAME=${packConfig.name || 'H5Pack'}
  APP_ANDROID_VERSION=${packConfig.APP_ANDROID_VERSION || '1.0.0'}
  APP_ANDROID_VERSION_CODE=${packConfig.APP_ANDROID_VERSION_CODE || '1'}	
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

async function handleAppLogo(yarnCommandDir: string) {
	if (!packConfig.logo) {
		return
	}
	try {
		const fileName = basename(packConfig.logo)
		const appLogoPath = resolve(process.cwd(), packConfig.logo)
		const goalPath = resolve(yarnCommandDir, `./public/logo/${fileName}`)
		if (isAvailableDir(appLogoPath)) {
			await copyFile(appLogoPath, goalPath)
			await handleCommand(
				yarnCommandDir,
				'npx',
				['iconkits', `--input=./public/logo/${fileName}`],
				originErrorMessage => {
					throw new Error(originErrorMessage)
				}
			)
		}
	} catch (error: any) {
		throw new PackError(GENERATE_APP_LOGO_ERROR, error.message)
	}
}

// async function handleSigning(yarnCommandDir: string) {

// 	try {
// 		const keystoreAbs = resolve(process.cwd(), packConfig.keystorePath)

// const buildGradlePath = resolve(appDir, './build.gradle')
// 		let gradleContent = await readFile(buildGradlePath, 'utf-8')
// 		const hasAndroidBlock = /android\s*\{[\s\S]*\}/.test(gradleContent)
// 		if (!hasAndroidBlock) {
// 			throw new Error('build.gradle has no android block')
// 		}
// 		if (
// 			!/signingConfigs\s*\{[\s\S]*release\s*\{[\s\S]*\}\s*\}/.test(
// 				gradleContent
// 			)
// 		) {
// 			gradleContent = gradleContent.replace(
// 				/android\s*\{/,
// 				`android {\n    signingConfigs {\n        release {\n            storeFile file('./keystore.jks')\n            storePassword '${packConfig.storePassword}'\n            keyAlias '${packConfig.keyAlias}'\n            keyPassword '${packConfig.keyPassword}'\n        }\n    }\n`
// 			)
// 		}
// 		const releaseBlockRegex = /buildTypes\s*\{\s*release\s*\{([\s\S]*?)\}\s*\}/
// 		const match = gradleContent.match(releaseBlockRegex)
// 		if (match && !/signingConfig\s+signingConfigs\.release/.test(match[1])) {
// 			const updatedRelease = match[0].replace(
// 				/release\s*\{/,
// 				`release {\n            signingConfig signingConfigs.release\n`
// 			)
// 			gradleContent = gradleContent.replace(releaseBlockRegex, updatedRelease)
// 		}
// 		await writeFileFs(buildGradlePath, gradleContent, 'utf-8')
// 	} catch (error: any) {
// 		throw new PackError(SIGNING_CONFIG_ERROR, error.message)
// 	}
// }

export async function handleCustomConfig(yarnCommandDir: string) {
	await handleEnvFile(yarnCommandDir)
	await handleSplash(yarnCommandDir)
	await handleAppLogo(yarnCommandDir)
	await handleSigning(yarnCommandDir)
	spinner.stop()
	spinner.succeed('✅ Custom Config Success')
}
