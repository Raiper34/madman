import { filesystem, GluegunCommand, GluegunFilesystem, GluegunPrint, GluegunPrompt } from 'gluegun'
import { simpleGit } from 'simple-git'
import { ConfigService } from '../common/config'


async function showRepos(filesystem: GluegunFilesystem, print: GluegunPrint, configService: ConfigService): Promise<void> {
  const config = await configService.getConfig();
  print.info(Object.values(config).map((val: { name: string }) => val.name).join('\n'))
}

async function removeRepo(prompt: GluegunPrompt, filesystem: GluegunFilesystem, print: GluegunPrint, configService: ConfigService): Promise<void> {
  const { name } = await prompt.ask({
    type: 'select',
    name: 'name',
    message: 'Select folder to use as manual source (if whole repo is manual source, leave empty)',
    choices: Object.values(await configService.getConfig())
      .map(man => ({name: man.name, value: man.name})),
  });
  filesystem.remove(`${configService.madmanPath}/${name}`);
  await configService.updateConfigRemove(name);
  print.info(`Manual ${name} removed successfully`);
}

async function addRepo(prompt: GluegunPrompt, print: GluegunPrint, configService: ConfigService): Promise<void> {
  const { repo } = await prompt.ask({
    type: 'input',
    message: 'Provide git repository https to clone from ',
    name: 'repo'
  })
  const { name } = await prompt.ask({
    type: 'input',
    message: 'Provide manual name (will be used for manual selecting)',
    name: 'name'
  });
  await simpleGit().clone(repo, `${configService.madmanPath}/${name}`)
  const files = filesystem.list(`${configService.madmanPath}/${name}`) // todo make it recursively and filter only folders
  const { folder } = await prompt.ask({
    type: 'autocomplete',
    name: 'folder',
    message: 'Select folder to use as manual source (if whole repo is manual source, leave empty)',
    choices: files.map(file => ({ name: file, value: file }))
  });
  await configService.updateConfig({ [name]: { name, repo, folder } });
  print.info(`Manual ${name} added successfully`);
}


const command: GluegunCommand = {
  name: 'config',
  alias: 'c',
  run: async (toolbox) => {
    const { print, filesystem, prompt, parameters } = toolbox
    const configService = await new ConfigService(filesystem, print);
    await configService.initHome();

    switch (parameters.string) {
      case 'list':
        return await showRepos(filesystem, print, configService);
      case 'add':
        return await addRepo(prompt, print, configService);
      case 'remove':
        return await removeRepo(prompt, filesystem, print, configService);
    }
  }
}

module.exports = command
