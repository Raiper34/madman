import { GluegunFilesystem } from 'gluegun'
import { TreeUtils } from 'simple-tree-utils'
import { InspectTreeResult } from 'fs-jetpack/types'
import { MANUAL_EXTENSION, MANUAL_IGNORED_FILES } from '../constants/global'

export class FileService {

  private readonly treeUtils = new TreeUtils();

  constructor(
    private readonly filesystem: GluegunFilesystem,
  ) {
  }

  getFolders(path: string): InspectTreeResult[] {
    const folderTree = this.filesystem.inspectTree(path);
    this.treeUtils.computePaths(folderTree.children, 'name', '/', 'path', '');
    return this.treeUtils.filter(folderTree.children, file => file.type === 'dir' && !file.path.replace(path, '').includes('.'));
  }

  getManuals(path: string, isManualRoot: boolean): InspectTreeResult[] {
    const pages = this.filesystem.inspectTree(path)
    return [
      ...(isManualRoot ? [] : [{type: 'dir', name: '..'}]),
      ...pages.children as any[], // todo fix it in future
    ].filter(file => file.type !== 'file' || (file.name.endsWith(`.${MANUAL_EXTENSION}`) && !MANUAL_IGNORED_FILES.includes(file.name)))
  }

  remove(path: string): void {
    this.filesystem.remove(path);
  }

  read(path: string): string {
    return this.filesystem.read(path);
  }

  move(oldPath: string, newPath: string): void {
    this.filesystem.move(oldPath, newPath)
  }

  separator(): string {
    return this.filesystem.separator;
  }
}