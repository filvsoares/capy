const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./io-C1a8eGPW.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css","./io-BKlWQB97.css"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload } from "./index-DyTq3Mxn.js";
import { l as library } from "./library-Be0wFXzF.js";
function declareBeans() {
  declareBean({
    name: "Library(lib:io)",
    provides: [library],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./io-C1a8eGPW.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LibraryIO(...deps)
  });
}
export {
  declareBeans
};
