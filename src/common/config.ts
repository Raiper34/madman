import { GluegunFilesystem, GluegunPrint } from 'gluegun'

export interface Config {
  [key: string]: { name: string, repo: string, folder?: string }
}

export class ConfigService {

  constructor(
    private readonly filesystem: GluegunFilesystem,
    private readonly print: GluegunPrint,
  ) {}

  get madmanPath(): string {
    return `${this.filesystem.homedir()}/.madman`
  }

  get madmanConfigPath(): string {
    return `${this.madmanPath}/config.json`
  }

  async getConfig(): Promise<Config> {
    return JSON.parse(this.filesystem.read(this.madmanConfigPath))
  }

  async saveConfig(config: Config): Promise<void> {
    await this.filesystem.write(this.madmanConfigPath, config)
  }

  async updateConfig(configUpdates: Config): Promise<void> {
    await this.saveConfig({ ...(await this.getConfig()), ...configUpdates })
  }

  async updateConfigRemove(keyToRemove: string): Promise<void> {
    const {[keyToRemove]: _removed, ...config} = await this.getConfig();
    await this.saveConfig(config);
  }

  async initHome(): Promise<void> {
    if (!this.filesystem.exists(this.madmanPath)) {
      this.filesystem.dir(this.madmanPath)
      this.print.info(`${this.madmanPath} created`)
      await this.saveConfig({})
      this.print.info(`${this.madmanConfigPath} created`)
    }
  }
}