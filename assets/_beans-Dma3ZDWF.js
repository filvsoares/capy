const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./addition-processor-BDMaeoi5.js","./string-concat-D_mh4wUB.js","./operation-DtccBRam.js","./expression-DdT-ttwU.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./simple-type-BIm_59qh.js","./type-CuPJgnn0.js","./operator-CJR6HJ2X.js","./token-YbVOofIc.js","./assignment-processor-zE8rouv0.js","./assignment-eya3ith5.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload } from "./index-BncJlCxS.js";
import { e as expressionReader } from "./expression-reader-BjAhtLB3.js";
import { o as operationProcessor } from "./operation-processor-fPNiYi1t.js";
import { t as typeReader } from "./type-reader-DO2kSkWN.js";
function declareBeans() {
  declareBean({
    name: "AdditionProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./addition-processor-BDMaeoi5.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9]) : void 0, import.meta.url),
    factory: (m, deps) => new m.AdditionProcessor(...deps)
  });
  declareBean({
    name: "AssignmentProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./assignment-processor-zE8rouv0.js"), true ? __vite__mapDeps([10,4,5,11,2,3,8,9]) : void 0, import.meta.url),
    factory: (m, deps) => new m.AssignmentProcessor(...deps)
  });
}
export {
  declareBeans
};
