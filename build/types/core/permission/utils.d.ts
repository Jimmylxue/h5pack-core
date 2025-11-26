import { TNativePermission } from 'src/types/type';
export declare function getMainFastPath(): string;
export declare function getManifestContent(): string;
export declare function updateMainManifestContent(newContent: string): void;
export declare function processSameMainFastPermission(type: TNativePermission): Promise<void>;
