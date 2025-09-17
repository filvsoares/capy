const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./dereference-processor-m31Rjfs8.js","./cg-dereference-Civ58NKr.js","./extra-Dqv87a62.js","./dereference-BMUsEu6t.js","./operation-ClDvK6AF.js","./expression-gX919Tzj.js","./index-BPYk8cqz.js","./index-DW4arCFm.css","./expression-processor-impl-DvNtRrbY.js","./string-literal-processor-COpaiw4j.js","./string-literal-BeYzi1M2.js","./simple-type-KY6tNXlF.js","./type-Dxgg9cQE.js","./expression-reader-impl-BKKSLU62.js","./token-reader-CWKbD-VP.js","./bracket-CET9I_Ke.js","./token-C93Hpdaz.js","./identifier-ClyZKQs9.js","./number-BeETDviW.js","./separator-BWSZyVah.js","./string-BMju32Tu.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, l as list } from "./index-BPYk8cqz.js";
import { e as expressionItemProcessor } from "./expression-item-processor-D6en1Vpj.js";
import { e as expressionProcessor } from "./expression-processor-CSzvSGPX.js";
import { e as expressionReader } from "./expression-reader-Ns-x8iIn.js";
import { i as identifierResolver } from "./identifier-resolver-BbtMg5Hh.js";
import { o as operationProcessor } from "./operation-processor-KGcHwoWg.js";
function declareBeans() {
  declareBean({
    name: "DereferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./dereference-processor-m31Rjfs8.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.DereferenceProcessor(...deps)
  });
  declareBean({
    name: "ExpressionProcessorImpl",
    provides: [expressionProcessor],
    dependencies: [list(expressionItemProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-processor-impl-DvNtRrbY.js"), true ? __vite__mapDeps([8,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionProcessorImpl(...deps)
  });
  declareBean({
    name: "StringLiteralProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./string-literal-processor-COpaiw4j.js"), true ? __vite__mapDeps([9,10,5,6,7,11,12]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StringLiteralProcessor(...deps)
  });
  declareBean({
    name: "ExpressionReaderImpl",
    provides: [expressionReader],
    dependencies: [list(identifierResolver), list(operationProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-reader-impl-BKKSLU62.js"), true ? __vite__mapDeps([13,6,7,3,4,5,11,12,10,14,15,16,17,18,19,20]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionReaderImpl(...deps)
  });
}
export {
  declareBeans
};
