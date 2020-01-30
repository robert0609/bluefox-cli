import download from 'download-git-repo';
import path from 'path';
import os from 'os';
import ora from 'ora';
import { isDirExist, removeDir } from './utility';

export async function loadRemoteTemplate(repo: string): Promise<string> {
  const spinner = ora('fetching project template...');
  spinner.start();
  try {
    return await new Promise((resolve, reject) => {
      const tmpDir = path.normalize(path.join(os.tmpdir(), 'bluefox-template'));
      if (isDirExist(tmpDir)) {
        removeDir(tmpDir);
      }
      download(repo, tmpDir, err => {
        if (err) {
          reject(err);
        } else {
          resolve(tmpDir);
        }
      });
    });
  } finally {
    spinner.stop();
  }
}
