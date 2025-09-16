import { library } from '@/modules/library/library';
import { ModuleInput } from '@/modules/parser/module-input';
import { ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { UseProvider } from '@/modules/use/use-provider';
import { Bean, getOneBean } from '@/util/beans';

export class LibraryUseProvider extends Bean implements UseProvider {
  async processUse(s: string, c: ToplevelReaderContext): Promise<string | undefined> {
    const lib = await getOneBean(library, `Library:${s}`);
    if (!lib) {
      return;
    }
    c.parserData.addInput(new ModuleInput(lib.moduleName, lib.sourceCode));
    c.parserData.processModule(lib.moduleName);
    return lib.moduleName;
  }
}
