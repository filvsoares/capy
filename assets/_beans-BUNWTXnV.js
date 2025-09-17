const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./dereference-processor-BpHjRDtn.js","./cg-dereference-Civ58NKr.js","./extra-Dqv87a62.js","./dereference-CZcnjHDC.js","./operation-CGef310c.js","./expression-BI_7gns1.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css","./expression-processor-impl-DCYqxSL_.js","./string-literal-processor-CZX3502n.js","./string-literal-bXpXWRwd.js","./simple-type-DZbjR7se.js","./type-Cw01Jon0.js","./expression-reader-impl-DFpJbMgJ.js","./token-reader-CWKbD-VP.js","./bracket-CzgbCMwV.js","./token-ofOFEBrc.js","./identifier-DiJZGL4m.js","./number-CZLMWsrr.js","./separator-DxWjJeA5.js","./string-sYMKUYfL.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, l as list } from "./index-DyTq3Mxn.js";
import { e as expressionItemProcessor } from "./expression-item-processor-u9WVjWwB.js";
import { e as expressionProcessor } from "./expression-processor-DQ-gQ6lR.js";
import { e as expressionReader } from "./expression-reader-D_oDuUvA.js";
import { i as identifierResolver } from "./identifier-resolver-CZD0pzuw.js";
import { o as operationProcessor } from "./operation-processor-D2Wlskad.js";
function declareBeans() {
  declareBean({
    name: "DereferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./dereference-processor-BpHjRDtn.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.DereferenceProcessor(...deps)
  });
  declareBean({
    name: "ExpressionProcessorImpl",
    provides: [expressionProcessor],
    dependencies: [list(expressionItemProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-processor-impl-DCYqxSL_.js"), true ? __vite__mapDeps([8,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionProcessorImpl(...deps)
  });
  declareBean({
    name: "StringLiteralProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./string-literal-processor-CZX3502n.js"), true ? __vite__mapDeps([9,10,5,6,7,11,12]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StringLiteralProcessor(...deps)
  });
  declareBean({
    name: "ExpressionReaderImpl",
    provides: [expressionReader],
    dependencies: [list(identifierResolver), list(operationProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-reader-impl-DFpJbMgJ.js"), true ? __vite__mapDeps([13,6,7,3,4,5,11,12,10,14,15,16,17,18,19,20]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionReaderImpl(...deps)
  });
}
export {
  declareBeans
};
