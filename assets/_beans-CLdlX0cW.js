const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./simple-type-reader-BYuLrlf4.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css","./identifier-DiJZGL4m.js","./token-ofOFEBrc.js","./keyword-DRNOSLz1.js","./simple-type-DZbjR7se.js","./type-Cw01Jon0.js","./type-reader-impl-Cl11N4i7.js"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload, l as list } from "./index-DyTq3Mxn.js";
import { t as typeItemReader } from "./type-item-reader-NiAJqXja.js";
import { t as typeReader } from "./type-reader-BgLSKYrq.js";
function declareBeans() {
  declareBean({
    name: "SimpleTypeReader",
    provides: [typeItemReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./simple-type-reader-BYuLrlf4.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.SimpleTypeReader(...deps)
  });
  declareBean({
    name: "TypeReaderImpl",
    provides: [typeReader],
    dependencies: [list(typeItemReader)],
    loadModule: () => __vitePreload(() => import("./type-reader-impl-Cl11N4i7.js"), true ? __vite__mapDeps([8,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.TypeReaderImpl(...deps)
  });
}
export {
  declareBeans
};
