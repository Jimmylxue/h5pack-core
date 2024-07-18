/**
 * AndroidRepositories 的仓库
 */
export const AndroidRepositories =
	'https://github.com/Jimmylxue/h5pack-native.git'

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
