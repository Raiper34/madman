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
        this.print.colors.bold('Remote'),
        this.print.colors.bold('Url'),
      ],
      ...Object.values(config).map(val => [
        val.name,
        val.folder,
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

  async fetchUpdate(): Promise<void> {
    const name = await this.inputService.select('name', 'Select remote manual to update', this.choiceService.repositories(this.configService.getConfig()));
    const spinner = this.print.spin({discardStdin: false, text: `Fetching ${name} updates`});
    try {
      await GitService.update(`${this.configService.madmanPath}/${name}`);
      spinner.succeed('Fetched successfully');
    } catch (e) {
      spinner.fail(e);
    }
  }

  async update(): Promise<void> {
    const name = await this.inputService.select('name', 'Select remote manual to update', this.choiceService.remoteRepositories(this.configService.getConfig()));
    const newName = await this.inputService.input('newName', 'Select new name', name);
    this.fileService.move(`${this.configService.madmanPath}/${name}`, `${this.configService.madmanPath}/${newName}`);
    this.configService.updateConfigEntry(name, newName);
    this.print.success(`Manual ${name} updated successfully`);
  }

  async addRepo(): Promise<void> {
    const name = await this.inputService.input('name', 'What is name of manual? (will be used for manual selecting)');
    let originFolder = `${this.configService.madmanPath}/${name}`;
    let repo: string;
    if (await this.inputService.select('remote', 'What type of manual is it?', [{name: 'remote', value: true}, {name: 'local', value: false}])) {
      repo = await this.inputService.input('repo', 'What is repository url? (https or ssh)');
      const spinner = this.print.spin({discardStdin: false, text: `Cloning ${name} repo into ${originFolder}`});
      try {
        await GitService.clone(repo, `${this.configService.madmanPath}/${name}`);
        spinner.succeed('Cloned successfully');
      } catch (e) {
        spinner.fail(e);
      }
    } else {
      originFolder = await this.inputService.input('folder', 'Wht is path to local folder? (absolute path)');
    }

    const folder = await this.inputService.select('folder', 'What is manual folder?', this.choiceService.folders(this.fileService.getFolders(originFolder) as any)); // todo fix
    this.configService.updateConfig({ [name]: { name, repo, folder: `${originFolder}/${folder}`} });
    this.print.success(`Manual ${name} added successfully`);
  }
}