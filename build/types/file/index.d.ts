/**
 * 清空文件夹
 */
export declare function removeDir(dir: string): Promise<void>;
/**
 * 判断一个路径是否是正确的路径
 */
export declare function isAvailableDir(path: string): boolean;
/**
 * 复制文件夹下的所有文件件
 */
export declare function copyFilesByDir(sourceDir: string, goalDir: string): Promise<void>;
