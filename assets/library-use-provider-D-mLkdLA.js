import { l as library } from "./library-Bd1ZY2BO.js";
import { B as Bean, g as getOneBean, M as ModuleInput } from "./index-BPYk8cqz.js";
class LibraryUseProvider extends Bean {
  async processUse(s, c) {
    if (!s.startsWith("lib:")) {
      return;
    }
    const lib = await getOneBean(library, `Library(${s})`);
    if (!lib) {
      return;
    }
    c.parserData.addInput(new ModuleInput(lib.moduleName, lib.sourceCode));
    c.parserData.processModule(lib.moduleName);
    return lib.moduleName;
  }
}
export {
  LibraryUseProvider
};
