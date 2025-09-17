const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./io-D1GicmMo.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css","./io-BKlWQB97.css"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload } from "./index-3ZiCjh5_.js";
import { l as library } from "./library-B5fsabsH.js";
function declareBeans() {
  declareBean({
    name: "Library(lib:io)",
    provides: [library],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./io-D1GicmMo.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LibraryIO(...deps)
  });
}
export {
  declareBeans
};
