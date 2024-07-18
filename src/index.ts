import { join } from 'path'
import { tmpdir } from 'os'
import { removeDir } from './file'
import { processAndroid } from './core/native'
import { promises } from 'fs'
import { buildFailHandle } from './base/error'
import { handlePackConfig } from './base/handleConfig'

async function main() {
	let tempDir
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
