const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./addition-processor-zzrmtqED.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css","./string-concat-Bztvo2Rl.js","./operation-Ow9MKkNb.js","./expression-I5NqfmRI.js","./simple-type-CKDhUhFe.js","./type-CXsu6tPh.js","./operator-BvOOTirp.js","./token-BtqAZLUf.js","./assignment-processor-YuTnWKOK.js","./assignment-sxxYQsme.js","./cg-assignment-processor-CfOQgVop.js","./string-concat-processor-B2ipLs3d.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload } from "./index-3ZiCjh5_.js";
import { e as expressionItemProcessor } from "./expression-item-processor-C9t-ZVl3.js";
import { e as expressionProcessor } from "./expression-processor-_k5xIL4f.js";
import { e as expressionReader } from "./expression-reader-CID0cSEz.js";
import { o as operationProcessor } from "./operation-processor-C_Lxwvu1.js";
import { t as typeReader } from "./type-reader-CTcnhb90.js";
function declareBeans() {
  declareBean({
    name: "AdditionProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./addition-processor-zzrmtqED.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9]) : void 0, import.meta.url),
    factory: (m, deps) => new m.AdditionProcessor(...deps)
  });
  declareBean({
    name: "AssignmentProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./assignment-processor-YuTnWKOK.js"), true ? __vite__mapDeps([10,1,2,11,4,5,8,9]) : void 0, import.meta.url),
    factory: (m, deps) => new m.AssignmentProcessor(...deps)
  });
  declareBean({
    name: "CgAssignmentProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./cg-assignment-processor-CfOQgVop.js"), true ? __vite__mapDeps([12,11,4,5,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.CgAssignmentProcessor(...deps)
  });
  declareBean({
    name: "StringConcatProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./string-concat-processor-B2ipLs3d.js"), true ? __vite__mapDeps([13,3,4,5,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StringConcatProcessor(...deps)
  });
}
export {
  declareBeans
};
