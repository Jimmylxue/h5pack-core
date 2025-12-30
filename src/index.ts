import { join } from 'path'
import { tmpdir } from 'os'
import { removeDir } from './file'
import { processAndroid } from './core/native'
import { promises } from 'fs'
import { buildFailHandle } from './base/error'
import { handlePackConfig } from './base/handleConfig'
import { doctor } from './command/doctor'
import { init } from './command/init'
import { processAndroidDev } from './command/dev'

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

export default async () => {
	const args = process.argv.slice(2)
	const command = args[0]
	if (command === 'doctor') {
		await doctor()
		return
	}
	if (command === 'init') {
		await init()
		return
	}
	if (command === 'dev') {
		handlePackConfig()
		const isWatch = args.includes('--watch')
		const isStart = args.includes('--start')
		await processAndroidDev(process.cwd(), {
			watch: isWatch,
			start: isStart,
		})
		return
	}
	handlePackConfig()
	main()
}

process.on('SIGINT', async () => {
	if (tempDir) {
		await removeDir(tempDir!)
	}
	process.exit()
})
