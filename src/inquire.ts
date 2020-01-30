import Commander from 'commander';
import path from 'path';
import inquirer, { QuestionCollection } from 'inquirer';
import packageInfo from '../package.json';
import semver from 'semver';
import { IManifest } from './IManifest.js';
import { loadRemoteTemplate } from './loadTemplate';
import { readFile } from './utility.js';

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
        const sourceDir = await loadRemoteTemplate('robert0609/fe-project');
        const manifest = JSON.parse(readFile(path.resolve(sourceDir, 'manifest.json'))) as IManifest;
        const categories = Object.keys(manifest);
        const categoryOptions = categories.map((n, i) => {
          return {
            name: n,
            value: i
          }
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

          const uniqueArr = Array.from(new Set(Object.values(selectedTemplate.needInjectFiles).reduce((a, b) => {
            return a.concat(b);
          }, [])));
          const questions: QuestionCollection = uniqueArr.map(key => {
            const q: {
              [key: string]: any;
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
                    return 'You muse input valid version!';
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
          answers['category'] = category;
          resolve({ configInfo: answers, selectedTemplate, sourceTemplateDir });
        } catch (e) {
          reject(e);
        }
      });

    program.parseAsync(process.argv);
  });
}
