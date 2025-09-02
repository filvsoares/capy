const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./dereference-processor-BtW9YMtF.js","./dereference-Dg4sNnGm.js","./dereference-B5apI-FG.js","./operation-DtccBRam.js","./expression-DdT-ttwU.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./expression-processor-impl-BOBfeGd8.js","./string-literal-processor-Rpuc0a20.js","./string-literal-BDu2J8WL.js","./simple-type-BIm_59qh.js","./type-CuPJgnn0.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, l as list } from "./index-BncJlCxS.js";
import { e as expressionItemProcessor } from "./expression-item-processor-UKu1INDX.js";
import { e as expressionProcessor } from "./expression-processor-cB5RnEiF.js";
function declareBeans() {
  declareBean({
    name: "DereferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./dereference-processor-BtW9YMtF.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.DereferenceProcessor(...deps)
  });
  declareBean({
    name: "ExpressionProcessorImpl",
    provides: [expressionProcessor],
    dependencies: [list(expressionItemProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-processor-impl-BOBfeGd8.js"), true ? __vite__mapDeps([7,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionProcessorImpl(...deps)
  });
  declareBean({
    name: "StringLiteralProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./string-literal-processor-Rpuc0a20.js"), true ? __vite__mapDeps([8,9,4,5,6,10,11]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StringLiteralProcessor(...deps)
  });
}
export {
  declareBeans
};
