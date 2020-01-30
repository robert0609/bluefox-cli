export interface IInquireResult {
    [key: string]: any;
}
export interface IWrapperInquireResult {
    configInfo: IInquireResult;
    sourceTemplateDir: string;
    selectedTemplate: {
        templateFolder: string;
        needInjectFiles: {
            [key: string]: string[];
        };
    };
}
export declare function inquire(): Promise<IWrapperInquireResult>;
