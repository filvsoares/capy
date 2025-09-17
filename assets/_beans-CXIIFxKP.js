const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./simple-type-reader-C7h2XQX_.js","./index-BPYk8cqz.js","./index-DW4arCFm.css","./identifier-ClyZKQs9.js","./token-C93Hpdaz.js","./keyword-D76bTD-h.js","./simple-type-KY6tNXlF.js","./type-Dxgg9cQE.js","./type-reader-impl-D-YLxBbk.js"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload, l as list } from "./index-BPYk8cqz.js";
import { t as typeItemReader } from "./type-item-reader-C8Z2XXud.js";
import { t as typeReader } from "./type-reader-BsMihJ1-.js";
function declareBeans() {
  declareBean({
    name: "SimpleTypeReader",
    provides: [typeItemReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./simple-type-reader-C7h2XQX_.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.SimpleTypeReader(...deps)
  });
  declareBean({
    name: "TypeReaderImpl",
    provides: [typeReader],
    dependencies: [list(typeItemReader)],
    loadModule: () => __vitePreload(() => import("./type-reader-impl-D-YLxBbk.js"), true ? __vite__mapDeps([8,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.TypeReaderImpl(...deps)
  });
}
export {
  declareBeans
};
