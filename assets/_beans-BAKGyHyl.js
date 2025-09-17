const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./dereference-processor-hZD5jaEM.js","./cg-dereference-Civ58NKr.js","./extra-Dqv87a62.js","./dereference-CBCVONbW.js","./operation-Ow9MKkNb.js","./expression-I5NqfmRI.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css","./expression-processor-impl-Dk8XgrM9.js","./string-literal-processor-COqZrlAZ.js","./string-literal-bR7Z568W.js","./simple-type-CKDhUhFe.js","./type-CXsu6tPh.js","./expression-reader-impl-CvqBu3Ou.js","./token-reader-CWKbD-VP.js","./bracket-DyCPjpk6.js","./token-BtqAZLUf.js","./identifier-D67RqHyN.js","./number-B1q5ngO1.js","./separator-DUrKHX5w.js","./string-DxqdHT9N.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, l as list } from "./index-3ZiCjh5_.js";
import { e as expressionItemProcessor } from "./expression-item-processor-C9t-ZVl3.js";
import { e as expressionProcessor } from "./expression-processor-_k5xIL4f.js";
import { e as expressionReader } from "./expression-reader-CID0cSEz.js";
import { i as identifierResolver } from "./identifier-resolver-drQlUuY0.js";
import { o as operationProcessor } from "./operation-processor-C_Lxwvu1.js";
function declareBeans() {
  declareBean({
    name: "DereferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./dereference-processor-hZD5jaEM.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.DereferenceProcessor(...deps)
  });
  declareBean({
    name: "ExpressionProcessorImpl",
    provides: [expressionProcessor],
    dependencies: [list(expressionItemProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-processor-impl-Dk8XgrM9.js"), true ? __vite__mapDeps([8,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionProcessorImpl(...deps)
  });
  declareBean({
    name: "StringLiteralProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./string-literal-processor-COqZrlAZ.js"), true ? __vite__mapDeps([9,10,5,6,7,11,12]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StringLiteralProcessor(...deps)
  });
  declareBean({
    name: "ExpressionReaderImpl",
    provides: [expressionReader],
    dependencies: [list(identifierResolver), list(operationProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-reader-impl-CvqBu3Ou.js"), true ? __vite__mapDeps([13,6,7,3,4,5,11,12,10,14,15,16,17,18,19,20]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionReaderImpl(...deps)
  });
}
export {
  declareBeans
};
