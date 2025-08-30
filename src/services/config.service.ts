import { GluegunFilesystem, GluegunPrint } from 'gluegun'
import { Config } from '../models/config'

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