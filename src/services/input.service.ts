import { GluegunParameters, GluegunPrompt } from 'gluegun'
import { PromptOptions } from 'gluegun/build/types/toolbox/prompt-enquirer-types'

export class InputService {

  constructor(
    private readonly prompt: GluegunPrompt,
    private readonly params: GluegunParameters,
  ) {
  }

  async input(name: string, message: string): Promise<string> {
    return await this.ask({type: 'input', message, name});
  }

  async select(name: string, message: string, choices: {name: string, value?: string, message?: string}[]): Promise<string> {
    return await this.ask({ type: 'autocomplete', name, message, choices});
  }

  private async ask(options: PromptOptions): Promise<string> {
    if (String(options.name) in this.params.options) {
      return this.params.options[String(options.name)];
    }
    const {[String(options.name)]: value} = await this.prompt.ask(options);
    return value;
  }
}