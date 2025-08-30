import { GluegunCommand } from 'gluegun'
import { ConfigService } from '../services/config.service'
import { RepositoryService } from '../services/repository.service'
import { InputService } from '../services/input.service'
import { FileService } from '../services/file.service'
import { ChoiceService } from '../services/choice.service'

const command: GluegunCommand = {
  name: 'fetch',
  alias: 'f',
  run: async (toolbox) => {
    const { print, filesystem, prompt, parameters, strings } = toolbox
    const configService = new ConfigService(filesystem, print);
    const inputService = new InputService(prompt, parameters);
    const fileService = new FileService(filesystem);
    const choiceService = new ChoiceService(print, strings);
    const repoService = new RepositoryService(print, fileService, configService, inputService, choiceService);
    configService.initHome();
    await repoService.fetchUpdate();
  }
}

module.exports = command
