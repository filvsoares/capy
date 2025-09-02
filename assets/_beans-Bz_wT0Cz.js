const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./expression-reader-impl-B34-V9OL.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./dereference-B5apI-FG.js","./operation-DtccBRam.js","./expression-DdT-ttwU.js","./simple-type-BIm_59qh.js","./type-CuPJgnn0.js","./string-literal-BDu2J8WL.js","./token-reader-BG65ZNxm.js","./bracket-BTNv1ZF5.js","./token-YbVOofIc.js","./identifier-CQkte7dE.js","./number-CdDxkblR.js","./separator-D1CNARzn.js","./string-BimwP1qe.js"])))=>i.map(i=>d[i]);
import { d as declareBean, l as list, _ as __vitePreload } from "./index-BncJlCxS.js";
import { e as expressionReader } from "./expression-reader-BjAhtLB3.js";
import { i as identifierResolver } from "./identifier-resolver-CosOBN9u.js";
import { o as operationProcessor } from "./operation-processor-fPNiYi1t.js";
function declareBeans() {
  declareBean({
    name: "ExpressionReaderImpl",
    provides: [expressionReader],
    dependencies: [list(identifierResolver), list(operationProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-reader-impl-B34-V9OL.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionReaderImpl(...deps)
  });
}
export {
  declareBeans
};
