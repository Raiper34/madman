import { InputService } from './input.service'
import { FileService } from './file.service'
import { ChoiceService } from './choice.service'

export class ManualService {

  constructor(
    private readonly inputService: InputService,
    private readonly fileService: FileService,
    private readonly choiceService: ChoiceService,
  ) {
  }

  async pickPage(manualPath: string): Promise<string> {
    const pageJson = await this.inputService.select(
      'pageJson',
      'Select doc to see',
      this.choiceService.manualPages(this.fileService.getManuals(manualPath)),
    );
    const page = JSON.parse(pageJson);
    return page.type === 'dir' ? this.pickPage(`${manualPath}/${page.name}`) : `${manualPath}/${page.name}`
  }

  async getManualContent(manualPath: string): Promise<string> {
    return this.fileService.read(await this.pickPage(manualPath))
  }


}