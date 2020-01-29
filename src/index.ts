import Vorpal, { CommandInstance } from 'vorpal';
// import packageInfo from '../package.json';

const vorpal = new Vorpal();

vorpal
  .command('init', 'init project')
  .action(async function (this: CommandInstance, args) {
    const r1 = await this.prompt({
      type: 'checkbox',
      name: 'project category',
      message: 'please select category:',
      choices: [
        { name: 'vue micro app', value: 1, short: 'vma' },
        { name: 'vue component', value: 2, short: 'vc'}
      ]
    });
    console.log(r1);
  });

vorpal.show().parse(process.argv);
