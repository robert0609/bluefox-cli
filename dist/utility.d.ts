/// <reference types="node" />
import fs from 'fs';
/**
 * 复制文件
 * @param {String} sourceFile
 * @param {String} destinationFile
 */
export declare function copyFile(sourceFile: string, destinationFile: string): void;
export declare function readFile(sourceFile: string): string;
export declare function writeFile(destinationFile: string, data: string): void;
export declare function isDirExist(dir: string): boolean;
export declare function readDir(dir: string): fs.Dirent[];
export declare function removeDir(dir: string): void;
export declare function traverseDir(baseDir: string, relativeDir: string, handleFileContent?: ((baseDir: string, relativeDir: string, fileName: string) => void)): void;
export declare function makeDir(dir: string): void;
