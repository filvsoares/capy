import { l as library } from "./library-Be0wFXzF.js";
import { B as Bean, e as getSingleBean } from "./index-DyTq3Mxn.js";
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
