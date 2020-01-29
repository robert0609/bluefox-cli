// import ejs from 'ejs';
// import path from 'path';
// import fs from 'fs';
import { inquire } from './inquire';


// const content = fs.readFileSync(path.resolve(__dirname, '../test_template/package.json'), 'utf8');
// const template = ejs.compile(content);
// const result = template({
//   name: 'test-project',
//   description: 'project description',
//   commandName: 'tp',
//   author: '1v1'
// });
// console.log(result);

(async function () {
  // download template repo
  // inquire developer, get config info
  const configInfo = await inquire();
  console.log(configInfo);
  // fill template, output destination dir
}()).catch(error => {
  console.error(error);
});
