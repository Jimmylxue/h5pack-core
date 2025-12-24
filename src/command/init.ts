import { writeFile, access } from 'fs/promises'
import { constants } from 'fs'
import { resolve } from 'path'
import ora from 'ora'

function getTemplate() {
	return JSON.stringify(
		{
			entry: './dist',
			name: 'H5PackApp',
			output: './',
			registry: 'github',
			buildFormat: 'apk',
			packageName: 'com.h5pack.native',
			versionName: '1.0.0',
			versionCode: '1',
			logo: '',
			splash: '',
			nativePermission: ['CAMERA', 'LOCATION', 'RECORD_AUDIO'],
			keystorePath: '',
			storePassword: '',
			keyAlias: '',
			keyPassword: '',
			log: false,
		},
		null,
		2
	)
}

export async function init() {
	const spinner = ora('Generating h5pack.json...').start()
	try {
		const target = resolve(process.cwd(), 'h5pack.json')
		try {
			await access(target, constants.F_OK)
			spinner.info('h5pack.json already exists')
			spinner.stop()
			return
		} catch {}
		await writeFile(target, getTemplate(), 'utf-8')
		spinner.succeed('h5pack.json created')
	} catch (error: any) {
		spinner.fail(error.message || 'create h5pack.json failed')
		throw error
	}
}
