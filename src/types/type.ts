export type TNativePermission = 'CAMERA' | 'LOCATION' | 'RECORD_AUDIO' | 'PHOTO_LIBRARY'

export type TPackConfig = {
	entry: string
	name: string
	buildFormat?: 'apk' | 'aab'
	splash?: string
	logo?: string
	output?: string
	log?: boolean
	cache?: boolean
	registry: 'github' | 'gitee'
	nativePermission?: TNativePermission[]
	keystorePath?: string
	storePassword?: string
	keyAlias?: string
	keyPassword?: string
	packageName?: string
	versionName?: string
	versionCode?: string
}

export type TPackError = {
	code: number
	message: string
}
