import download from 'download';
import path from 'path';
import os from 'os';
import ora from 'ora';
import { isDirExist, removeDir } from './utility';

const projectUrl = 'https://butterfly001.oss-cn-beijing.aliyuncs.com/project/fe-project.zip';

export async function loadRemoteTemplate(repo: string): Promise<string> {
  const spinner = ora('fetching project template...');
  spinner.start();
  try {
    const tmpDir = path.normalize(path.join(os.tmpdir(), 'bluefox-template'));
    if (isDirExist(tmpDir)) {
      removeDir(tmpDir);
    }
    await download(projectUrl, tmpDir, {
      extract: true
    });
    return tmpDir;
  } finally {
    spinner.stop();
  }
}
