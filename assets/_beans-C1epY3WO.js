const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./codegen-impl-DXJzFnlb.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css"])))=>i.map(i=>d[i]);
import { d as declareBean, c as codegen, l as list, _ as __vitePreload } from "./index-3ZiCjh5_.js";
import { c as codegenHook } from "./codegen-hook-DRVPHsty.js";
import { s as symbolProcessor } from "./symbol-processor-BHpaDr0V.js";
function declareBeans() {
  declareBean({
    name: "CodegenImpl",
    provides: [codegen],
    dependencies: [list(symbolProcessor), list(codegenHook)],
    loadModule: () => __vitePreload(() => import("./codegen-impl-DXJzFnlb.js"), true ? __vite__mapDeps([0,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.CodegenImpl(...deps)
  });
}
export {
  declareBeans
};
