import { TNativePermission } from 'src/types/type';
export declare function getMainFastPath(): string;
export declare function getManifestContent(): string;
export declare function updateMainManifestContent(newContent: string): void;
/**
 * 处理指定类型的权限注入
 * 1. 解析 PermissionEntry，生成带 maxSdkVersion 的 XML 节点
 * 2. 与 Manifest 已有权限合并去重
 * 3. 一次写入
 */
export declare function processPermission(type: TNativePermission): Promise<void>;
