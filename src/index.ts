import ejs from 'ejs';
import path from 'path';
import { inquire, IInquireResult } from './inquire';
import { traverseDir, isDirExist, makeDir, copyFile, readFile, writeFile } from './utility';
import { IManifest } from './IManifest';

function fillConfig(content: string, varibles: any): string {
  const template = ejs.compile(content);
  const result = template(varibles);
  return result;
}

(async function () {
  const sourceDir = path.resolve(__dirname, '../test_template');
  // TODO: const destinationDir = process.cwd();
  const destinationDir = path.resolve(__dirname, '../target');

  // download template repo, load manifest
  const manifest = JSON.parse(readFile(path.resolve(sourceDir, 'manifest.json'))) as IManifest;
  const categories = Object.keys(manifest);

  // inquire developer, get config info
  const configInfo = await inquire(manifest);
  const selectedTemplate = manifest[categories[configInfo.category as number]];

  // fill template, output destination dir
  const sourceTemplateDir = path.resolve(sourceDir, selectedTemplate.templateFolder);
  traverseDir(sourceTemplateDir, '.', (baseDir: string, relativeDir: string, name: string) => {
    const sourceFile = path.normalize(path.join(baseDir, relativeDir, name));
    const destDir = path.normalize(path.join(destinationDir, relativeDir));
    const destFile = path.normalize(path.join(destDir, name));
    if (!isDirExist(destDir)) {
      makeDir(destDir);
    }
    console.log('traverse', baseDir, relativeDir, name);
    // 判断是否需要注入变量
    const varibles = selectedTemplate.needInjectFiles[name];
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
