/**
 * 清空文件夹
 * @param dir 目标目录
 * @param silent 是否静默模式（不显示 spinner 提示），用于预清理场景
 */
export declare function removeDir(dir: string, silent?: boolean): Promise<void>;
/**
 * 判断一个路径是否是正确的路径
 */
export declare function isAvailableDir(path: string): boolean;
export declare function copyFilesByDir(sourceDir: string, goalDir: string): void;
