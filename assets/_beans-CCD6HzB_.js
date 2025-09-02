const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./codegen-impl-mDmY6FlP.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./context-ByTyzBz7.js"])))=>i.map(i=>d[i]);
import { d as declareBean, c as codegen, l as list, _ as __vitePreload } from "./index-BncJlCxS.js";
import { c as codegenExtraWriter } from "./codegen-extra-writer-D1Ah2Ft-.js";
import { s as symbolProcessor } from "./symbol-processor-CQBUj8aa.js";
function declareBeans() {
  declareBean({
    name: "CodegenImpl",
    provides: [codegen],
    dependencies: [list(symbolProcessor), list(codegenExtraWriter)],
    loadModule: () => __vitePreload(() => import("./codegen-impl-mDmY6FlP.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.CodegenImpl(...deps)
  });
}
export {
  declareBeans
};
