import { l as library } from "./library-Bd1ZY2BO.js";
import { B as Bean, e as getSingleBean } from "./index-BPYk8cqz.js";
async function loadLibrary(c, name) {
  const lib = await getSingleBean(library, `Library(${name})`);
  return lib.nativeMethods(c);
}
class LibraryRunnerArgsProvider extends Bean {
  getArgs(c) {
    return {
      loadLibrary(name) {
        return loadLibrary(c, name);
      }
    };
  }
}
export {
  LibraryRunnerArgsProvider
};
