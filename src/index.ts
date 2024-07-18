import { resolve, join } from 'path'
import { tmpdir } from 'os'
import { removeDir } from './file'
import { TPackConfig } from './types/type'
import { processAndroid } from './core/native'
import { promises } from 'fs'
import { buildFailHandle } from './base/error'

let packConfig: TPackConfig

async function main() {
	let tempDir
	try {
		const rootDir = tmpdir()
		tempDir = join(rootDir, 'app-build')
		await promises.mkdir(tempDir, { recursive: true })
		console.log('build in tempDir', tempDir)
		await processAndroid(packConfig, tempDir)
		//
		// throw new PackError(GIT_CLONE_ERROR)
	} catch (error: any) {
		buildFailHandle(error)
		removeDir(tempDir!)
	}
}

export default () => {
	packConfig = require(resolve(process.cwd(), 'h5pack.json'))
	main()
}
