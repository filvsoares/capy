import { l as library } from "./library-B5fsabsH.js";
import { B as Bean, e as getSingleBean } from "./index-3ZiCjh5_.js";
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
