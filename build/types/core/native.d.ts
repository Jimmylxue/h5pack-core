/**
 * 复制打包资源
 */
export declare function copyBuildSource(rootDir: string, errorHandle: (originErrorMessage: string) => void): Promise<void>;
export declare function processAndroid(rootDir: string): Promise<void>;
