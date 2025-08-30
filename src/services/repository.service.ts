import { GluegunPrint } from 'gluegun'
import { ConfigService } from './config.service'
import { InputService } from './input.service'
import { GitService } from './git.service'
import { FileService } from './file.service'
import { ChoiceService } from './choice.service'

export class RepositoryService {

  constructor(
    private readonly print: GluegunPrint,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
    private readonly inputService: InputService,
    private readonly choiceService: ChoiceService,
  ) {}

  showRepos(): void {
    const config = this.configService.getConfig();
    this.print.info(Object.values(config).map((val: { name: string }) => val.name).join('\n'))
  }

  async removeRepo(): Promise<void> {
    const name = await this.inputService.select('name', 'Select manual to remove', this.choiceService.repositories(this.configService.getConfig()));
    this.fileService.remove(`${this.configService.madmanPath}/${name}`);
    this.configService.updateConfigRemove(name);
    this.print.success(`Manual ${name} removed successfully`);
  }

  async addRepo(): Promise<void> {
    const repo = await this.inputService.input('repo', 'Provide git repository https to clone from');
    const name = await this.inputService.input('name', 'Provide manual name (will be used for manual selecting)');
    await GitService.clone(repo, `${this.configService.madmanPath}/${name}`);

    const folder = await this.inputService.select('folder', 'Select manual to remove', this.choiceService.folders(this.fileService.getFolders(`${this.configService.madmanPath}/${name}`) as any)); // todo fix
    this.configService.updateConfig({ [name]: { name, repo, folder } });
    this.print.info(`Manual ${name} added successfully`);
  }
}