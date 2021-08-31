import Commander from 'commander';
import path from 'path';
import inquirer, { QuestionCollection } from 'inquirer';
import packageInfo from '../package.json';
import semver from 'semver';
import { IManifest, IProjectGroup } from './IManifest';
import { loadRemoteTemplate } from './loadTemplate';
import { readFile } from './utility';
import Separator from 'inquirer/lib/objects/separator';

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

export async function inquire() {
  return await new Promise<IWrapperInquireResult>((resolve, reject) => {
    const program = new Commander.Command();
    program.version(packageInfo.version);

    program
      .command('init')
      .description('init project')
      .action(async function () {
        // download template repo, load manifest
        const sourceDir = await loadRemoteTemplate();
        const projectGroup = JSON.parse(readFile(path.resolve(sourceDir, 'manifest.json'))) as IProjectGroup;

        let manifest: IManifest = {};
        const categories: string[] = [];
        const categoryOptions: ({ name: string; value: number; } | Separator)[] = [];

        const groupNames = Object.keys(projectGroup);
        groupNames.forEach((groupName: string) => {
          categoryOptions.push(new inquirer.Separator(groupName));
          const groupManifest = projectGroup[groupName];
          const projectNames = Object.keys(groupManifest);
          projectNames.forEach((c, i) => {
            manifest[c] = groupManifest[c];
            categoryOptions.push({
              name: c,
              value: i + categories.length
            });
          });
          categories.push(...projectNames);
        });

        // inquire developer, get config info
        try {
          const { category } = await inquirer.prompt({
            type: 'list',
            name: 'category',
            message: 'Please select project category:',
            choices: categoryOptions,
            validate(selection: number[]) {
              if (selection.length < 1) {
                return 'You must choose project category!';
              }
              return true;
            }
          });
          const selectedTemplate = manifest[categories[category as number]];
          const sourceTemplateDir = path.resolve(sourceDir, selectedTemplate.templateFolder);
          const validation = selectedTemplate.validation;

          const uniqueArr = Array.from(new Set(Object.values(selectedTemplate.needInjectFiles).reduce((a, b) => {
            return a.concat(b);
          }, [])));
          const questions: QuestionCollection = uniqueArr.map(key => {
            const q: {
              [key: string]: unknown;
              default?: string;
            } = {
              type: 'input',
              name: key,
              message: `Please input package ${key}:`,
              validate(inputContent: string) {
                if (inputContent === undefined || inputContent === '') {
                  return `You must input package ${key}!`;
                }
                if (key === 'version') {
                  const r = semver.valid(inputContent);
                  if (r === null) {
                    return 'You must input valid version!';
                  }
                }
                // 如果有配置了validation，则要追加自定义校验处理
                if (validation && validation[key]) {
                  const validate = validation[key];
                  const regex = new RegExp(validate.rule);
                  if (!regex.test(inputContent)) {
                    return validate.message;
                  }
                }
                return true;
              }
            };
            if (key === 'version') {
              q['default'] = '0.1.1';
            }
            return q;
          });

          const answers = await inquirer.prompt(questions);
          const categoryName = categories[category as number];
          answers['category'] = categoryName;
          // 判断如果是选择的Boston微前端的项目模板，则生成name配置项
          if (categoryName.startsWith('boston')) {
            if (answers['libraryName']) {
              answers['name'] = `boston-library-${answers['libraryName']}`;
            } else if (answers['appName']) {
              answers['name'] = `boston-app-${answers['appName']}`;
            }
          }
          resolve({ configInfo: answers, selectedTemplate, sourceTemplateDir });
        } catch (e) {
          reject(e);
        }
      });

    program.parseAsync(process.argv);
  });
}
