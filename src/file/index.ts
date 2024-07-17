// import { rm, readdir, copyFile } from 'fs/promises'
import { rm } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from 'fs'

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
// export async function copyFilesByDir(sourceDir: string, goalDir: string) {
// 	try {
// 		const files = await readdir(sourceDir)
// 		files.forEach(async file => {
// 			const sourcePath = join(sourceDir, file)
// 			const destPath = join(goalDir, file)
// 			await copyFile(sourcePath, destPath)
// 		})
// 	} catch (error: any) {
// 		console.error(error)
// 	}
// }
export function copyFilesByDir(sourceDir: string, goalDir: string) {
	// 创建目标文件夹,如果不存在的话
	if (!existsSync(goalDir)) {
		mkdirSync(goalDir, { recursive: true })
	}

	// 遍历源文件夹下的所有内容
	const files = readdirSync(sourceDir)
	for (const file of files) {
		const sourcePath = join(sourceDir, file)
		const goalPath = join(goalDir, file)

		// 如果是文件夹,递归复制
		if (statSync(sourcePath).isDirectory()) {
			copyFilesByDir(sourcePath, goalPath)
		}
		// 如果是文件,复制文件
		else {
			copyFileSync(sourcePath, goalPath)
		}
	}
}
