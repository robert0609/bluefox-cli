export interface IManifest {
    [key: string]: {
        templateFolder: string;
        needInjectFiles: {
            [key: string]: string[];
        };
    };
}
