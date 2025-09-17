const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./codegen-impl-TARuCrPW.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css"])))=>i.map(i=>d[i]);
import { d as declareBean, c as codegen, l as list, _ as __vitePreload } from "./index-DyTq3Mxn.js";
import { c as codegenHook } from "./codegen-hook-PMV6UFv2.js";
import { s as symbolProcessor } from "./symbol-processor-TWQTEQy9.js";
function declareBeans() {
  declareBean({
    name: "CodegenImpl",
    provides: [codegen],
    dependencies: [list(symbolProcessor), list(codegenHook)],
    loadModule: () => __vitePreload(() => import("./codegen-impl-TARuCrPW.js"), true ? __vite__mapDeps([0,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.CodegenImpl(...deps)
  });
}
export {
  declareBeans
};
