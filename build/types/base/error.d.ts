import { TPackError } from 'src/types/type';
export declare class PackError extends Error {
    failMessage?: TPackError;
    originErrorMessage?: string;
    constructor(failMessage: TPackError, originErrorMessage: string);
}
export declare function buildFailHandle(error: PackError): void;
