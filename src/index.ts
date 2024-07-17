import { resolve, join } from 'path'
import { tmpdir } from 'os'
import { removeDir } from './file'
import { TPackConfig } from './types/type'
import { processAndroid } from './core/native'
import { promises } from 'fs'

console.log('hello world')

let packConfig: TPackConfig

async function main() {
	console.log('pack', packConfig)
	const rootDir = tmpdir()
	const tempDir = join(rootDir, 'app-build')
	await promises.mkdir(tempDir, { recursive: true })

	console.log('tempDir', tempDir)

	await processAndroid(packConfig, tempDir)
	removeDir(tempDir)
}

export default () => {
	packConfig = require(resolve(process.cwd(), 'h5pack.json'))
	main()
}
