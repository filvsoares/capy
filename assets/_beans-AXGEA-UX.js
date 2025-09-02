const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./simple-type-reader-ehBDhdUo.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./identifier-CQkte7dE.js","./token-YbVOofIc.js","./keyword-DP2VjTYJ.js","./simple-type-BIm_59qh.js","./type-CuPJgnn0.js","./type-reader-impl-ieDC6Iie.js"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload, l as list } from "./index-BncJlCxS.js";
import { t as typeItemReader } from "./type-item-reader-CEV5cC_3.js";
import { t as typeReader } from "./type-reader-DO2kSkWN.js";
function declareBeans() {
  declareBean({
    name: "SimpleTypeReader",
    provides: [typeItemReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./simple-type-reader-ehBDhdUo.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.SimpleTypeReader(...deps)
  });
  declareBean({
    name: "TypeReaderImpl",
    provides: [typeReader],
    dependencies: [list(typeItemReader)],
    loadModule: () => __vitePreload(() => import("./type-reader-impl-ieDC6Iie.js"), true ? __vite__mapDeps([8,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.TypeReaderImpl(...deps)
  });
  declareBean({
    name: "SimpleTypeReader",
    provides: [typeItemReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./simple-type-reader-ehBDhdUo.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.SimpleTypeReader(...deps)
  });
}
export {
  declareBeans
};
