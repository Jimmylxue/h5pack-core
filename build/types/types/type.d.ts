export type TPackConfig = {
    entry: string;
    name: string;
    splash?: string;
    logo?: string;
    output?: string;
    log?: boolean;
};
export type TPackError = {
    code: number;
    message: string;
};
