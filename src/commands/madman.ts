import { GluegunCommand } from 'gluegun'
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';

const command: GluegunCommand = {
  name: 'madman',
  run: async (toolbox) => {
    const { print, filesystem, prompt } = toolbox
    marked.use(markedTerminal());

    const madmanPath = `${filesystem.homedir()}/.madman`;
    const files = filesystem.list(madmanPath);
    print.info(files);
    const {fileName} = await prompt.ask({
      type: 'autocomplete',
      name: 'fileName',
      message: 'Select doc to see',
        choices: files.map(file => ({name: print.colors.magenta(file), value: file})),
    });

    const fileContent = filesystem.read(`${madmanPath}/${fileName}`)
    print.info(marked.parse(fileContent))
  }
}

module.exports = command
