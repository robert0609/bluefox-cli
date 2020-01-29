import Commander from 'commander';
import inquirer, { QuestionCollection } from 'inquirer';
import packageInfo from '../package.json';
import semver from 'semver';
import { IManifest } from './IManifest.js';

export interface IInquireResult {
  [key: string]: any;
}

export async function inquire(manifest: IManifest) {
  const categories = Object.keys(manifest);
  const categoryOptions = categories.map((n, i) => {
    return {
      name: n,
      value: i
    }
  });

  return await new Promise<IInquireResult>((resolve, reject) => {
    const program = new Commander.Command();
    program.version(packageInfo.version);

    program
      .command('init')
      .description('init project')
      .action(async function () {
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
              message: `Please input package ${key}`,
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
          resolve(answers);
        } catch (e) {
          reject(e);
        }
      });

    program.parseAsync(process.argv);
  });
}
