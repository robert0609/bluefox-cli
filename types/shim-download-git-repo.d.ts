
declare module 'download-git-repo' {

  function download(repository: string, destination: string, callback: (err: Error) => void): void;

  export = download;
}

