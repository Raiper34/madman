import { InputService } from './input.service'
import { FileService } from './file.service'
import { ChoiceService } from './choice.service'
import * as path from 'path';

export class ManualService {

  constructor(
    private readonly inputService: InputService,
    private readonly fileService: FileService,
    private readonly choiceService: ChoiceService,
  ) {
  }

  async pickPage(manualPath: string, root: string): Promise<string> {
    const pageJson = await this.inputService.select(
      'pageJson',
      'Select doc to see',
      this.choiceService.manualPages(this.fileService.getManuals(manualPath, this.isRootPath(manualPath, root))),
    );
    const page = JSON.parse(pageJson);
    const pagePath = path.resolve(`${manualPath}/${page.name}`);
    return page.type === 'dir' ? this.pickPage(pagePath, root) : pagePath;
  }

  async getManualContent(manualPath: string, root: string): Promise<string> {
    return this.fileService.read(await this.pickPage(manualPath, root))
  }

  private isRootPath(manualPath: string, root: string): boolean {
    return path.resolve(root) === path.resolve(manualPath);
  }
}