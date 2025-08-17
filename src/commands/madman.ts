import { GluegunCommand } from 'gluegun'
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import { ConfigService } from '../common/config'

const command: GluegunCommand = {
  name: 'madman',
  run: async (toolbox) => {
    const { print, filesystem, prompt } = toolbox
    marked.use(markedTerminal());

    const configService = await new ConfigService(filesystem, print);

    const {manual} = await prompt.ask({
      type: 'autocomplete',
      name: 'manual',
      message: 'Select manual to see',
      choices: Object.values(await configService.getConfig())
        .map(man => ({name: print.colors.magenta(man.name), value: [configService.madmanPath, man.name, man.folder].join('/')})),
    });

    const pages = filesystem.list(manual);
    const {page} = await prompt.ask({
      type: 'autocomplete',
      name: 'page',
      message: 'Select doc to see',
        choices: pages.map(page => ({name: print.colors.magenta(page), value: `${manual}/${page}`})),
    });

    const fileContent = filesystem.read(page)
    print.info(marked.parse(fileContent))
  }
}

module.exports = command
