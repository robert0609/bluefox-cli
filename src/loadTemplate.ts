import download from 'download-git-repo';
import path from 'path';
import os from 'os';

export async function loadRemoteTemplate(repo: string): Promise<string> {
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
}
