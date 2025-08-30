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
    this.print.table([
      [
        this.print.colors.bold('Name'),
        this.print.colors.bold('Path'),
        this.print.colors.bold('Local'),
        this.print.colors.bold('Repo'),
      ],
      ...Object.values(config).map(val => [
        val.name,
        [this.configService.madmanPath, val.name, val.folder].join(this.fileService.separator()),
        val.repo ? this.print.checkmark : this.print.xmark,
        val.repo,
      ]),
    ], {format: 'markdown'});
  }

  async removeRepo(): Promise<void> {
    const name = await this.inputService.select('name', 'Select manual to remove', this.choiceService.repositories(this.configService.getConfig()));
    this.fileService.remove(`${this.configService.madmanPath}/${name}`);
    this.configService.updateConfigRemove(name);
    this.print.success(`Manual ${name} removed successfully`);
  }

  async addRepo(): Promise<void> {
    const name = await this.inputService.input('name', 'What is name of manual? (will be used for manual selecting)');
    let originFolder: string;
    let repo: string;
    if (await this.inputService.select('repo', 'What type of manual is it?', [{name: 'remote', value: true}, {name: 'local', value: false}])) {
      repo = await this.inputService.input('repo', 'What is repository url? (https or ssh)');
      await GitService.clone(repo, `${this.configService.madmanPath}/${name}`);
      originFolder = `${this.configService.madmanPath}/${name}`;
    } else {
      originFolder = await this.inputService.input('folder', 'Wht is path to local folder? (absolute path)');
    }

    const folder = await this.inputService.select('folder', 'Select manual to remove', this.choiceService.folders(this.fileService.getFolders(originFolder) as any)); // todo fix
    this.configService.updateConfig({ [name]: { name, repo, folder: `${originFolder}/${folder}`} });
    this.print.success(`Manual ${name} added successfully`);
  }
}