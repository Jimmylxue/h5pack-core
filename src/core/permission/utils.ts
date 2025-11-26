import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tempDir } from 'src'
import { manifestPath, PERMISSION_MAP } from './const'
import { TNativePermission } from 'src/types/type'
import xml2js from 'xml2js'

export function getMainFastPath() {
	return join(tempDir, manifestPath)
}

export function getManifestContent() {
	const xmlContent = readFileSync(getMainFastPath(), 'utf8')
	return xmlContent
}

export function updateMainManifestContent(newContent: string) {
	writeFileSync(getMainFastPath(), newContent, 'utf8')
}

export async function processSameMainFastPermission(type: TNativePermission) {
	const xmlContent = getManifestContent()

	// 解析 XML
	const parser = new xml2js.Parser()
	const result = await parser.parseStringPromise(xmlContent)

	PERMISSION_MAP[type].forEach(perm =>
		result.manifest['uses-permission'].push({
			$: {
				'android:name': perm,
			},
		})
	)

	// 构建回 XML
	const builder = new xml2js.Builder({
		renderOpts: { pretty: true, indent: '  ' }, // 保持格式美观
	})

	let updatedXml = builder.buildObject(result)

	// 关键步骤：使用正则表达式移除 XML 声明
	updatedXml = updatedXml.replace(/<\?xml[^?>]*\?>\s*/i, '')

	updateMainManifestContent(updatedXml)
}
