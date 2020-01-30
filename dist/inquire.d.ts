import { IManifest } from './IManifest.js';
export interface IInquireResult {
    [key: string]: any;
}
export declare function inquire(manifest: IManifest): Promise<IInquireResult>;
