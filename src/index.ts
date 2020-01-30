import ejs from 'ejs';
import path from 'path';
import { inquire, IInquireResult } from './inquire';
import { traverseDir, isDirExist, makeDir, copyFile, readFile, writeFile } from './utility';

function fillConfig(content: string, varibles: any): string {
  const template = ejs.compile(content);
  const result = template(varibles);
  return result;
}

(async function () {
  // inquire developer, get config info
  const { configInfo, selectedTemplate, sourceTemplateDir } = await inquire();

  // fill template, output destination dir
  const destinationDir = path.resolve(process.cwd(), configInfo['name']);
  const needInjectFiles: {
    [key: string]: string[];
  } = {};
  for (let k in selectedTemplate.needInjectFiles) {
    needInjectFiles[path.normalize(path.join(sourceTemplateDir, k))] = selectedTemplate.needInjectFiles[k];
  }
  traverseDir(sourceTemplateDir, '.', (baseDir: string, relativeDir: string, name: string) => {
    const sourceFile = path.normalize(path.join(baseDir, relativeDir, name));
    const destDir = path.normalize(path.join(destinationDir, relativeDir));
    const destFile = path.normalize(path.join(destDir, name));
    if (!isDirExist(destDir)) {
      makeDir(destDir);
    }
    // console.log('traverse', baseDir, relativeDir, name);
    // 判断是否需要注入变量
    const varibles = needInjectFiles[sourceFile];
    if (varibles && varibles.length > 0) {
      const vs: IInquireResult = {};
      varibles.forEach(k => {
        vs[k] = configInfo[k];
      });
      const newContent = fillConfig(readFile(sourceFile), vs);
      writeFile(destFile, newContent);
    } else {
      copyFile(sourceFile, destFile);
    }

  });
}()).catch(error => {
  console.error(error);
});
