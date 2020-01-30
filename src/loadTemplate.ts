import download from 'download-git-repo';
import path from 'path';
import os from 'os';
import ora from 'ora';

export async function loadRemoteTemplate(repo: string): Promise<string> {
  const spinner = ora('fetching project template...');
  spinner.start();
  try {
    return await new Promise((resolve, reject) => {
      const tmpDir = path.normalize(path.join(os.tmpdir(), 'bluefox-template'));
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
