import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tempDir } from 'src/shared'
import { manifestPath, PERMISSION_MAP, PermissionEntry } from './const'
import { TNativePermission } from 'src/types/type'
import xml2js from 'xml2js'

export function getMainFastPath() {
	return join(tempDir, manifestPath)
}

export function getManifestContent() {
	return readFileSync(getMainFastPath(), 'utf8')
}

export function updateMainManifestContent(newContent: string) {
	writeFileSync(getMainFastPath(), newContent, 'utf8')
}

/**
 * 将 PermissionEntry 解析为 XML 属性对象
 */
function resolvePermission(entry: PermissionEntry): Record<string, string> {
	if (typeof entry === 'string') {
		return { 'android:name': entry }
	}
	return {
		'android:name': entry.name,
		'android:maxSdkVersion': String(entry.maxSdkVersion),
	}
}

/**
 * 按 android:name 去重，合并 maxSdkVersion（取更小值）
 */
function deduplicatePermissions(
	permissions: Record<string, string>[]
): Record<string, string>[] {
	const map = new Map<string, Record<string, string>>()

	for (const perm of permissions) {
		const name = perm['android:name']
		const existing = map.get(name)

		if (!existing) {
			map.set(name, { ...perm })
		} else {
			// 合并 maxSdkVersion：取更小值（更严格的约束）
			const existingMax = existing['android:maxSdkVersion']
			const currentMax = perm['android:maxSdkVersion']
			if (existingMax && currentMax) {
				existing['android:maxSdkVersion'] = String(
					Math.min(Number(existingMax), Number(currentMax))
				)
			} else if (currentMax) {
				existing['android:maxSdkVersion'] = currentMax
			}
		}
	}

	return Array.from(map.values())
}

/**
 * 处理指定类型的权限注入
 * 1. 解析 PermissionEntry，生成带 maxSdkVersion 的 XML 节点
 * 2. 与 Manifest 已有权限合并去重
 * 3. 一次写入
 */
export async function processPermission(type: TNativePermission) {
	const xmlContent = getManifestContent()

	// 解析 XML
	const parser = new xml2js.Parser()
	const result = await parser.parseStringPromise(xmlContent)

	// 确保 uses-permission 数组存在
	if (!result.manifest['uses-permission']) {
		result.manifest['uses-permission'] = []
	}

	// 解析当前类型的所有权限
	const newPermissions = PERMISSION_MAP[type].map(resolvePermission)

	// 与已有权限合并去重
	const existingPermissions: Record<string, string>[] =
		result.manifest['uses-permission'].map((p: any) => p.$ || {})
	const allPermissions = [...existingPermissions, ...newPermissions]
	const deduplicated = deduplicatePermissions(allPermissions)

	// 回写
	result.manifest['uses-permission'] = deduplicated.map(attr => ({ $: attr }))

	// 构建回 XML
	const builder = new xml2js.Builder({
		renderOpts: { pretty: true, indent: '  ' },
	})

	let updatedXml = builder.buildObject(result)

	// 移除 XML 声明
	updatedXml = updatedXml.replace(/<\?xml[^?>]*\?>\s*/i, '')

	updateMainManifestContent(updatedXml)
}
