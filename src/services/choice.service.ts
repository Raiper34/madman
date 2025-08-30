import { InspectTreeResult } from 'fs-jetpack/types'
import { GluegunPrint, GluegunStrings } from 'gluegun'
import { Config } from '../models/config'
import { Choice } from '../models/choice'
import { MANUAL_EXTENSION } from '../constants/global'

export class ChoiceService {

  constructor(
    private readonly print: GluegunPrint,
    private readonly strings: GluegunStrings,
  ) {
  }

  repositories(config: Config): Choice[] {
    return Object.values(config).map(man => ({name: man.name, value: man.name}));
  }

  remoteRepositories(config: Config): Choice[] {
    return Object.values(config).filter(man => man.repo).map(man => ({name: man.name, value: man.name}));
  }

  folders(folders: (InspectTreeResult & {path: string})[]): Choice[] {
    return [
      {name: '. (root)', path: '.'},
      ...folders,
    ].map(file => ({
      message: file.path === '.' ? this.rootColor('. (root)') : this.folderColor(`${file.path}${file.name}`),
      name: file.path === '.'  ? '.' : `${file.path}${file.name}`,
    }))
  }

  manuals(config: Config): Choice[] {
    return Object.values(config)
      .map(man => ({
        name: this.fileColor(man.name),
        value: man.folder,
      }));
  }

  manualPages(files: InspectTreeResult[]): Choice[] {
    return files.map(file => ({
      name: file.name === '..' ? this.parentColor(file.name) : (file.type === 'dir' ? this.folderColor(file.name) : this.fileColor(this.manualOption(file.name))),
      value: JSON.stringify(file),
    }));
  }

  private manualOption(file: string): string {
    return this.strings.lowerCase(file.replace(`.${MANUAL_EXTENSION}`, ''))
  }

  private rootColor(str: string): string {
    return this.print.colors.red(str);
  }

  private parentColor(str: string): string {
    return this.print.colors.red(str);
  }

  private folderColor(str: string): string {
    return this.print.colors.blue(str);
  }

  private fileColor(str: string): string {
    return this.print.colors.green(str);
  }
}