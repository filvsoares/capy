const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./io-DMLXNFIu.js","./index-BPYk8cqz.js","./index-DW4arCFm.css","./io-BKlWQB97.css"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload } from "./index-BPYk8cqz.js";
import { l as library } from "./library-Bd1ZY2BO.js";
function declareBeans() {
  declareBean({
    name: "Library(lib:io)",
    provides: [library],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./io-DMLXNFIu.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LibraryIO(...deps)
  });
}
export {
  declareBeans
};
