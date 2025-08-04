import { GluegunCommand } from 'gluegun'
import { simpleGit } from 'simple-git';

function getRepoName(githubUrl: string): string {
  const regex = /github\.com\/[\w-]+\/([\w.-]+)(?:\.git)?$/
  const match = githubUrl.match(regex)
  return match ? match[1] : ''
}


const command: GluegunCommand = {
  name: 'config',
  alias: 'c',
  run: async (toolbox) => {
    const { print, filesystem, prompt } = toolbox
    const madmanPath = `${filesystem.homedir()}/.madman`;

    if (!filesystem.exists(madmanPath)) {
      print.info(`${madmanPath} created`)
      filesystem.dir(madmanPath);
    }

    const {repositoryUrl} = await prompt.ask({
      type: 'input',
      message: 'Provide git repository https',
      name: 'repositoryUrl'
    });
    const repoName = getRepoName(repositoryUrl)
    simpleGit().clone(repositoryUrl, `${madmanPath}/${repoName}`)
  }
}

module.exports = command
