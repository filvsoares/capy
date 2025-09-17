const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./simple-type-reader-DRZpvlUn.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css","./identifier-D67RqHyN.js","./token-BtqAZLUf.js","./keyword-BPOLCCDh.js","./simple-type-CKDhUhFe.js","./type-CXsu6tPh.js","./type-reader-impl-ulmmefd7.js"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload, l as list } from "./index-3ZiCjh5_.js";
import { t as typeItemReader } from "./type-item-reader-C9xHfki5.js";
import { t as typeReader } from "./type-reader-CTcnhb90.js";
function declareBeans() {
  declareBean({
    name: "SimpleTypeReader",
    provides: [typeItemReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./simple-type-reader-DRZpvlUn.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.SimpleTypeReader(...deps)
  });
  declareBean({
    name: "TypeReaderImpl",
    provides: [typeReader],
    dependencies: [list(typeItemReader)],
    loadModule: () => __vitePreload(() => import("./type-reader-impl-ulmmefd7.js"), true ? __vite__mapDeps([8,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.TypeReaderImpl(...deps)
  });
}
export {
  declareBeans
};
