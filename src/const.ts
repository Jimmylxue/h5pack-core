/**
 * AndroidRepositories 的仓库
 */
export const AndroidRepositories = {
	github: 'https://github.com/Jimmylxue/h5pack-native.git',
	gitee: 'https://gitee.com/jimmyxuexue/h5pack-native.git',
}

export const GIT_CLONE_ERROR = {
	code: 10000,
	message: 'clone异常，检查网络代理，或配置为国内代理',
}

export const COPY_BUILD_SOURCE_ERROR = {
	code: 10001,
	message: '获取静态资源异常，检查h5pack.json中entry配置',
}

export const YARN_INSTALL_ERROR = {
	code: 10002,
	message: 'yarn install异常，检查网络代理，或配置为国内代理',
}

export const GENERATE_ENV_ERROR = {
	code: 10003,
	message: '.env文件生成异常，请检查h5pack.json中name配置',
}

export const GENERATE_SPLASH_ERROR = {
	code: 10004,
	message: 'splash启动页生成异常，请检查h5pack.json中splash相关配置',
}

export const BUILD_APP_ERROR = {
	code: 10005,
	message: 'release APP异常，请检查安卓打包环境',
}

export const BUILD_SUCCESS_CALLBACK_ERROR = {
	code: 10006,
	message: 'copy release异常，请检查h5pack.json中output配置',
}

export const GENERATE_APP_LOGO_ERROR = {
	code: 10007,
	message: 'appLogo启动页生成异常，请检查h5pack.json中logo相关配置',
}

export const APP_NATIVE_PERMISSION_CONFIG_ERROR = {
	code: 10008,
	message:
		'nativePermission配置异常，请检查h5pack.json中nativePermission相关配置',
}

export const SIGNING_CONFIG_ERROR = {
	code: 10009,
	message: '签名配置异常，请检查h5pack.json中keystore相关配置',
}

export const BUILD_FORMAT_ERROR = {
	code: 10010,
	message: '构建类型异常，请设置buildFormat为apk或aab',
}

export const DEV_ERROR = {
	code: 10011,
	message: 'dev环境启动异常',
}
