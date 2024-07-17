import { rm, readdir, copyFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

/**
 * 清空文件夹
 */
export async function removeDir(dir: string) {
	try {
		await rm(dir, { recursive: true, force: true })
		console.log('success clear data')
	} catch (error: any) {
		console.error('remove temp dir fail in ', dir)
	}
}

/**
 * 判断一个路径是否是正确的路径
 */
export function isAvailableDir(path: string) {
	return existsSync(path)
}

/**
 * 复制文件夹下的所有文件件
 */
export async function copyFilesByDir(sourceDir: string, goalDir: string) {
	try {
		const files = await readdir(sourceDir)
		files.forEach(async file => {
			const sourcePath = join(sourceDir, file)
			const destPath = join(goalDir, file)
			await copyFile(sourcePath, destPath)
		})
	} catch (error: any) {
		console.error(error)
	}
}
