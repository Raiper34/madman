import { GluegunCommand } from 'gluegun'
import { marked } from 'marked'
import { markedTerminal } from 'marked-terminal'
import { ConfigService } from '../services/config.service'
import pager from 'less-pager-mini'
import { InputService } from '../services/input.service'
import { FileService } from '../services/file.service'
import { ChoiceService } from '../services/choice.service'
import { ManualService } from '../services/manual.service'

const command: GluegunCommand = {
  name: 'madman',
  run: async (toolbox) => {
    const { print, filesystem, prompt, strings, parameters } = toolbox
    marked.use(markedTerminal())

    const configService = new ConfigService(filesystem, print)
    const inputService = new InputService(prompt, parameters);
    const fileService = new FileService(filesystem);
    const choiceService = new ChoiceService(print, strings);
    const manualService = new ManualService(inputService, fileService, choiceService);
    configService.initHome();

    const manualList = choiceService.manuals(configService.getConfig());
    if (manualList.length) {
      const manual = await inputService.select('manual', 'Select manual to see', manualList);
      await pager(marked.parse(await manualService.getManualContent(manual, manual)));
    } else {
      print.warning('No manual found! Try add one with "madman add" command');
    }
  }
}


module.exports = command
