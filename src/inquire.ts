import Commander from 'commander';
import inquirer from 'inquirer';
import packageInfo from '../package.json';
import semver from 'semver';

export interface IInquireResult {
  [key: string]: any;
}

export async function inquire() {
  return await new Promise<IInquireResult>((resolve, reject) => {
    const program = new Commander.Command();
    program.version(packageInfo.version);

    program
      .command('init')
      .description('init project')
      .action(async function () {
        try {
          const answers = await inquirer.prompt([{
            type: 'list',
            name: 'category',
            message: 'Please select project category:',
            choices: [
              { name: 'vue micro app', value: 1 },
              { name: 'vue component', value: 2 }
            ],
            validate(selection: number[]) {
              if (selection.length < 1) {
                return 'You must choose project category!';
              }
              return true;
            }
          }, {
            type: 'input',
            name: 'name',
            message: 'Please input package name:',
            validate(inputContent: string) {
              if (inputContent === undefined || inputContent === '') {
                return 'You must input package name!';
              }
              return true;
            }
          }, {
            type: 'input',
            name: 'version',
            message: 'Please input package version:',
            default: '0.1.1',
            validate(inputContent: string) {
              if (inputContent === undefined || inputContent === '') {
                return 'You must input package version!';
              }
              const r = semver.valid(inputContent);
              if (r === null) {
                return 'You muse input valid version!';
              }
              return true;
            }
          }, {
            type: 'input',
            name: 'description',
            message: 'Please input package description:',
            validate(inputContent: string) {
              if (inputContent === undefined || inputContent === '') {
                return 'You must input package description!';
              }
              return true;
            }
          }, {
            type: 'input',
            name: 'commandName',
            message: 'Please input commandName:',
            validate(inputContent: string) {
              if (inputContent === undefined || inputContent === '') {
                return 'You must input commandName!';
              }
              return true;
            }
          }, {
            type: 'input',
            name: 'author',
            message: 'Please input author:',
            validate(inputContent: string) {
              if (inputContent === undefined || inputContent === '') {
                return 'You must input author!';
              }
              return true;
            }
          }]);
          resolve(answers);
        } catch (e) {
          reject(e);
        }
      });

    program.parseAsync(process.argv);
  });
}
