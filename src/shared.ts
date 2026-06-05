/**
 * 共享状态模块 —— 抽离入口模块的可变状态，避免循环依赖
 */
export let tempDir: any

export function setTempDir(dir: any) {
	tempDir = dir
}
