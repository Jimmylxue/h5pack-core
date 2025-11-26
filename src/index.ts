import { join } from 'path'
import { tmpdir } from 'os'
import { removeDir } from './file'
import { processAndroid } from './core/native'
import { promises } from 'fs'
import { buildFailHandle } from './base/error'
import { handlePackConfig } from './base/handleConfig'

/**
 * 执行的路径
 */
export let tempDir: any

async function main() {
	try {
		const rootDir = tmpdir()
		tempDir = join(rootDir, 'app-build')
		await promises.mkdir(tempDir, { recursive: true })
		await processAndroid(tempDir)
	} catch (error: any) {
		buildFailHandle(error)
		removeDir(tempDir!)
	}
}

export default () => {
	handlePackConfig()
	main()
}

process.on('SIGINT', async () => {
	await removeDir(tempDir!)
	// 在这里执行清理操作
	process.exit() // 退出程序
})
