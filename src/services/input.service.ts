import { GluegunParameters, GluegunPrompt } from 'gluegun'
import { PromptOptions } from 'gluegun/build/types/toolbox/prompt-enquirer-types'
import { Choice } from '../models/choice'

export class InputService {

  constructor(
    private readonly prompt: GluegunPrompt,
    private readonly params: GluegunParameters,
  ) {
  }

  async input(name: string, message: string, initial?: string): Promise<string> {
    return await this.ask({type: 'input', message, name, initial});
  }

  async select(name: string, message: string, choices: Choice[]): Promise<string> {
    return await this.ask({ type: 'autocomplete', name, message, choices} as PromptOptions);
  }

  private async ask(options: PromptOptions): Promise<string> {
    if (String(options.name) in this.params.options) {
      return this.params.options[String(options.name)];
    }
    const {[String(options.name)]: value} = await this.prompt.ask(options);
    return value;
  }
}