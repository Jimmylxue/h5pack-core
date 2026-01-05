/**
 * dev 指令执行的操作
 */
export declare function processAndroidDev(rootDir: string, options: {
    watch: boolean;
    start: boolean;
    devPort?: number;
    reversePort?: number;
}): Promise<void>;
