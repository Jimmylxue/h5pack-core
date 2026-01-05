/**
 * 处理 打包时的 env文件
 */
export declare function handleEnvFile(yarnCommandDir: string, isDevMode?: boolean, port?: number): Promise<void>;
export declare function handleCustomConfig(yarnCommandDir: string): Promise<void>;
export declare function handleStartLocal(yarnCommandDir: string): Promise<void>;
export declare function handleServerMode(yarnCommandDir: string): Promise<void>;
export declare function handleDevCustomConfig(yarnCommandDir: string): Promise<void>;
