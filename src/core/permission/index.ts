import { PackError } from 'src/base/error'
import { packConfig } from 'src/base/handleConfig'
import { spinner } from 'src/base/spinner'
import { APP_NATIVE_PERMISSION_CONFIG_ERROR } from 'src/const'
import { processPermission } from './utils'
import { TNativePermission } from 'src/types/type'

const PermissionList: TNativePermission[] = [
	'CAMERA',
	'LOCATION',
	'RECORD_AUDIO',
	'PHOTO_LIBRARY',
]

export async function handleNativePermission(rootDir: string) {
	const nativePermission = packConfig.nativePermission
	if (!nativePermission) {
		spinner.info('✅ 无特殊权限配置 ......')
		return
	}

	if (!Array.isArray(nativePermission)) {
		spinner.stop()
		throw new PackError(APP_NATIVE_PERMISSION_CONFIG_ERROR, nativePermission)
	}

	if (
		Array.isArray(nativePermission) &&
		!nativePermission.every(permission => PermissionList.includes(permission))
	) {
		spinner.stop()
		throw new PackError(
			APP_NATIVE_PERMISSION_CONFIG_ERROR,
			JSON.stringify(nativePermission)
		)
	}

	const usePermissions = [...new Set(nativePermission)]

	for (const type of usePermissions) {
		await processPermission(type)
		spinner.succeed(`✅ Handle Native Permission ${type} SUCCESS!`)
	}
}
