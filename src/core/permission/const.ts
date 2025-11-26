export const manifestPath =
	'h5pack-native/android/app/src/main/AndroidManifest.xml'

export const PERMISSION_MAP = {
	CAMERA: [
		'android.permission.CAMERA',
		'android.permission.WRITE_EXTERNAL_STORAGE',
		'android.permission.READ_EXTERNAL_STORAGE',
	],
	cameraWithAudio: [
		'android.permission.CAMERA',
		'android.permission.RECORD_AUDIO',
		'android.permission.WRITE_EXTERNAL_STORAGE',
		'android.permission.READ_EXTERNAL_STORAGE',
	],
	LOCATION: [
		'android.permission.ACCESS_FINE_LOCATION',
		'android.permission.ACCESS_COARSE_LOCATION',
	],
	microphone: ['android.permission.RECORD_AUDIO'],
	storage: [
		'android.permission.WRITE_EXTERNAL_STORAGE',
		'android.permission.READ_EXTERNAL_STORAGE',
	],
}
