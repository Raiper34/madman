import { simpleGit } from 'simple-git'

export class GitService {

  constructor() {

  }

  static async clone(repoUrl: string, path: string): Promise<void> {
    await simpleGit().clone(repoUrl, path);
  }
}