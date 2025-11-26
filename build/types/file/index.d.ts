/**
 * 清空文件夹
 */
export declare function removeDir(dir: string): Promise<void>;
/**
 * 判断一个路径是否是正确的路径
 */
export declare function isAvailableDir(path: string): boolean;
export declare function copyFilesByDir(sourceDir: string, goalDir: string): void;
