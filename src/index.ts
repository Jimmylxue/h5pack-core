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
		const serverArg = args.find(a => a.startsWith('--server='))
		const reverseArg = args.find(a => a.startsWith('--reverse='))
		let devPort: number | undefined
		let reversePort: number | undefined
		if (serverArg) {
			const val = serverArg.split('=')[1]
			if (/^https?:\/\//.test(val)) {
				try {
					const u = new URL(val)
					devPort = u.port
						? parseInt(u.port, 10)
						: u.protocol === 'https:'
						? 443
						: 80
				} catch {}
			} else if (/^\d+$/.test(val)) {
				devPort = parseInt(val, 10)
			}
		}
		if (reverseArg) {
			const val = reverseArg.split('=')[1]
			if (/^\d+$/.test(val)) {
				reversePort = parseInt(val, 10)
			}
		}
		await processAndroidDev(process.cwd(), {
			watch: isWatch,
			start: isStart,
			devPort,
			reversePort,
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
