import { GluegunCommand, GluegunFilesystem, GluegunPrint, GluegunPrompt, GluegunStrings } from 'gluegun'
import { marked } from 'marked'
import { markedTerminal } from 'marked-terminal'
import { ConfigService } from '../common/config'
import pager from 'less-pager-mini'
import { TreeUtils } from 'simple-tree-utils'

const IGNORED_FILES = ['licence.md', 'license.md', 'readme.md', 'changelog.md'];

async function pickPage(filesystem: GluegunFilesystem, print: GluegunPrint, prompt: GluegunPrompt, strings: GluegunStrings, manual: string): Promise<string> {
  const treeUtils = new TreeUtils()
  const pages = filesystem.inspectTree(manual)
  treeUtils.computePaths([pages], 'name', '/', 'path', manual)
  const { pageJson } = await prompt.ask({
    type: 'autocomplete',
    name: 'pageJson',
    message: 'Select doc to see',
    choices: (pages.children.length ? pages.children as any[] : [{ type: 'dir', path: `${manual}/..`, name: '..' }])
      .filter(file => file.type !== 'file' || (file.name.endsWith('.md') && !IGNORED_FILES.includes(file.name)))
      .map(file => ({
        name: file.type === 'dir' ? print.colors.blue(file.name) : print.colors.green(strings.lowerCase(file.name.replace('.md', ''))),
        value: JSON.stringify(file)
      }))
  })
  const page = JSON.parse(pageJson)
  return page.type === 'dir' ? pickPage(filesystem, print, prompt, strings, `${manual}/${page.name}`) : `${manual}/${page.name}`
}

const command: GluegunCommand = {
  name: 'madman',
  run: async (toolbox) => {
    const { print, filesystem, prompt, strings } = toolbox
    marked.use(markedTerminal())

    const configService = await new ConfigService(filesystem, print)

    const { manual } = await prompt.ask({
      type: 'autocomplete',
      name: 'manual',
      message: 'Select manual to see',
      choices: Object.values(await configService.getConfig())
        .map(man => ({
          name: print.colors.magenta(man.name),
          value: [configService.madmanPath, man.name, man.folder].join('/')
        }))
    })

    const fileContent = filesystem.read(await pickPage(filesystem, print, prompt, strings, manual))
    await pager(marked.parse(fileContent))
  }
}


module.exports = command
