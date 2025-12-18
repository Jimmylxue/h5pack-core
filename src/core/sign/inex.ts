import { copyFile } from 'fs/promises'
import { resolve as presolve, basename } from 'path'
import { packConfig } from 'src/base/handleConfig'
import { isAvailableDir } from 'src/file'
const properties = require('properties-parser')

export function handleSigning(yarnCommandDir: string) {
	return new Promise(async (resolve, reject) => {
		if (
			!packConfig.keystorePath ||
			!packConfig.storePassword ||
			!packConfig.keyAlias ||
			!packConfig.keyPassword
		) {
			resolve(true)
			return
		}
		const keyStoreBaseName = basename(packConfig.keystorePath)
		const keystoreAbs = presolve(process.cwd(), packConfig.keystorePath)
		if (!isAvailableDir(keystoreAbs)) {
			throw new Error('keystorePath is not a available path')
		}

		const appDir = presolve(yarnCommandDir, './android/app/')
		const targetStore = presolve(appDir, keyStoreBaseName)

		await copyFile(keystoreAbs, targetStore)

		const buildGradlePath = presolve(
			yarnCommandDir,
			'./android/gradle.properties'
		)

		const editor = properties.createEditor(buildGradlePath)

		editor.set('H5PACK_APP_KEY_STORE_FILE', keyStoreBaseName)
		editor.set('H5PACK_APP_KEY_STORE_PASSWORD', packConfig.storePassword)
		editor.set('H5PACK_APP_KEY_ALIAS', packConfig.keyAlias)
		editor.set('H5PACK_APP_KEY_PASSWORD', packConfig.keyPassword)

		editor.save(buildGradlePath, (err: any) => {
			if (err) {
				console.error('❌ 保存文件时出错:', err)
				reject()
			} else {
				console.log('✅ gradle.properties 更新成功。')
				resolve(true)
			}
		})
	})
}
