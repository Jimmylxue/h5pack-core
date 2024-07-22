import { resolve } from 'path'
import { TPackConfig } from 'src/types/type'

/**
 * 存储全局配置信息
 */
export let packConfig: TPackConfig

export function handlePackConfig() {
	packConfig = require(resolve(process.cwd(), 'h5pack.json'))
	packConfig.registry = packConfig.registry || 'github' // 设置默认配置
}
