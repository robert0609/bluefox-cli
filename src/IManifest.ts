export interface IManifest {
  [key: string]: {
    templateFolder: string;
    needInjectFiles: {
      [key: string]: string[];
    };
    validation?: {
      [key: string]: {
        rule: string;
        message: string;
      }
    };
  };
}

export interface IProjectGroup {
  [key: string]: IManifest;
}
