import ora from 'ora';
export declare let spinner: ora.Ora;
export declare let otherSpinner: ora.Ora;
/**
 * 在同一行更新子进程输出，而不是每次打印新行
 * 通过节流限制更新频率，避免高频 data 事件导致 spinner 剧烈跳动
 */
export declare function showSpinner(message: string): void;
/**
 * 子进程结束后，将 spinner 置为 succeed 状态并重置
 * 恢复主 spinner 的显示
 */
export declare function finishShowSpinner(): void;
