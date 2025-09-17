const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./addition-processor--P0EOKey.js","./index-BPYk8cqz.js","./index-DW4arCFm.css","./string-concat-BbVCTsjP.js","./operation-ClDvK6AF.js","./expression-gX919Tzj.js","./simple-type-KY6tNXlF.js","./type-Dxgg9cQE.js","./operator-BNRdXr0O.js","./token-C93Hpdaz.js","./assignment-processor-BXRf6D3X.js","./assignment-CN3cZpvq.js","./cg-assignment-processor-CbCK8N-D.js","./string-concat-processor-B5_H_3-f.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload } from "./index-BPYk8cqz.js";
import { e as expressionItemProcessor } from "./expression-item-processor-D6en1Vpj.js";
import { e as expressionProcessor } from "./expression-processor-CSzvSGPX.js";
import { e as expressionReader } from "./expression-reader-Ns-x8iIn.js";
import { o as operationProcessor } from "./operation-processor-KGcHwoWg.js";
import { t as typeReader } from "./type-reader-BsMihJ1-.js";
function declareBeans() {
  declareBean({
    name: "AdditionProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./addition-processor--P0EOKey.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9]) : void 0, import.meta.url),
    factory: (m, deps) => new m.AdditionProcessor(...deps)
  });
  declareBean({
    name: "AssignmentProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./assignment-processor-BXRf6D3X.js"), true ? __vite__mapDeps([10,1,2,11,4,5,8,9]) : void 0, import.meta.url),
    factory: (m, deps) => new m.AssignmentProcessor(...deps)
  });
  declareBean({
    name: "CgAssignmentProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./cg-assignment-processor-CbCK8N-D.js"), true ? __vite__mapDeps([12,11,4,5,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.CgAssignmentProcessor(...deps)
  });
  declareBean({
    name: "StringConcatProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./string-concat-processor-B5_H_3-f.js"), true ? __vite__mapDeps([13,3,4,5,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StringConcatProcessor(...deps)
  });
}
export {
  declareBeans
};
