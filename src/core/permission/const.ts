export const manifestPath =
	'h5pack-native/android/app/src/main/AndroidManifest.xml'

/**
 * 权限条目：纯字符串表示无版本限制，对象形式表示带有 maxSdkVersion 约束
 * maxSdkVersion 表示该权限仅对 <= 该 API Level 的设备生效
 */
export type PermissionEntry =
	| string
	| { name: string; maxSdkVersion: number }

/**
 * 版本感知的权限映射
 *
 * 基于 targetSdkVersion = 34 (Android 14) 设计：
 * - WRITE_EXTERNAL_STORAGE: API 29 起对 app 私有目录无效，API 33 起完全忽略 → maxSdkVersion=28
 * - READ_EXTERNAL_STORAGE:  API 33 起被细粒度媒体权限替代 → maxSdkVersion=32
 * - READ_MEDIA_IMAGES:      API 33+ 细粒度媒体权限
 *
 * 已删除的死代码 key：cameraWithAudio、microphone、storage
 */
export const PERMISSION_MAP: Record<string, PermissionEntry[]> = {
	CAMERA: [
		'android.permission.CAMERA',
		{ name: 'android.permission.WRITE_EXTERNAL_STORAGE', maxSdkVersion: 28 },
		{ name: 'android.permission.READ_EXTERNAL_STORAGE', maxSdkVersion: 32 },
		'android.permission.READ_MEDIA_IMAGES',
	],
	LOCATION: [
		'android.permission.ACCESS_FINE_LOCATION',
		'android.permission.ACCESS_COARSE_LOCATION',
	],
	RECORD_AUDIO: [
		'android.permission.RECORD_AUDIO',
	],
	PHOTO_LIBRARY: [
		{ name: 'android.permission.READ_EXTERNAL_STORAGE', maxSdkVersion: 32 },
		'android.permission.READ_MEDIA_IMAGES',
	],
}
