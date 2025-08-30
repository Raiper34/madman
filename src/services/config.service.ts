import { GluegunFilesystem, GluegunPrint } from 'gluegun'
import { Config } from '../models/config'
import { Manual } from '../models/manual'

export class ConfigService {

  constructor(
    private readonly filesystem: GluegunFilesystem,
    private readonly print: GluegunPrint
  ) {
  }

  get madmanPath(): string {
    return `${this.filesystem.homedir()}/.madman`
  }

  get madmanConfigPath(): string {
    return `${this.madmanPath}/config.json`
  }

  getConfig(): Config {
    return JSON.parse(this.filesystem.read(this.madmanConfigPath))
  }

  saveConfig(config: Config): void {
    this.filesystem.write(this.madmanConfigPath, config)
  }

  updateConfig(configUpdates: Config): void {
    this.saveConfig({ ...this.getConfig(), ...configUpdates })
  }

  updateConfigEntry(name: string, newName: string): void {
    const oldManual = this.getConfig()[name];
    this.updateConfigRemove(name);
    const updatedManual: Manual = {
      ...oldManual,
      name: newName,
      folder: oldManual.folder.replace(`${this.madmanPath}/${name}`, `${this.madmanPath}/${newName}`),
    };
    this.updateConfig({[updatedManual.name]: updatedManual});
  }

  updateConfigRemove(keyToRemove: string): void {
    const { [keyToRemove]: _removed, ...config } = this.getConfig()
    this.saveConfig(config)
  }

  initHome(): void {
    if (!this.filesystem.exists(this.madmanPath)) {
      this.filesystem.dir(this.madmanPath)
      this.print.info(`${this.madmanPath} created`)
      this.saveConfig({})
      this.print.info(`${this.madmanConfigPath} created`)
    }
  }
}