import fs from 'fs';
import path from 'path';

/**
 * 复制文件
 * @param {String} sourceFile
 * @param {String} destinationFile
 */
export function copyFile(sourceFile: string, destinationFile: string) {
  fs.copyFileSync(sourceFile, destinationFile);
}

export function readFile(sourceFile: string): string {
  return fs.readFileSync(sourceFile, {
    encoding: 'utf8'
  }).toString();
}

export function writeFile(destinationFile: string, data: string) {
  fs.writeFileSync(destinationFile, data, {
    encoding: 'utf8'
  });
}

export function isDirExist(dir: string): boolean {
  return fs.existsSync(dir);
}

export function readDir(dir: string): fs.Dirent[] {
  const dirents = fs.readdirSync(dir, {
    encoding: 'utf8',
    withFileTypes: true
  });
  return dirents;
}

export function removeDir(dir: string): void {
  if (isDirExist(dir)) {
    fs.rmdirSync(dir, {
      recursive: true
    });
  }
}

export function traverseDir(baseDir: string, relativeDir: string, handleFileContent?: ((baseDir: string, relativeDir: string, fileName: string) => void)) {
  const fullDir = path.normalize(path.join(baseDir, relativeDir))
  const dirents = readDir(fullDir);
  dirents.forEach(d => {
    if (d.isDirectory()) {
      traverseDir(baseDir, path.normalize(path.join(relativeDir, d.name)), handleFileContent);
    } else if (d.isFile()) {
      if (handleFileContent) {
        handleFileContent(baseDir, relativeDir, d.name);
      }
    }
  });
}

export function makeDir(dir: string) {
  fs.mkdirSync(dir, {
    recursive: true
  });
}
