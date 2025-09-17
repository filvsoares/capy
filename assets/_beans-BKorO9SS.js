const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./addition-processor-BaDMccDb.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css","./string-concat-BJdp4c9M.js","./operation-CGef310c.js","./expression-BI_7gns1.js","./simple-type-DZbjR7se.js","./type-Cw01Jon0.js","./operator-D6f5KmIA.js","./token-ofOFEBrc.js","./assignment-processor-DNbn0FNJ.js","./assignment-CPCbZnEw.js","./cg-assignment-processor-Cj8hzQje.js","./string-concat-processor-tj3KgkdO.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload } from "./index-DyTq3Mxn.js";
import { e as expressionItemProcessor } from "./expression-item-processor-u9WVjWwB.js";
import { e as expressionProcessor } from "./expression-processor-DQ-gQ6lR.js";
import { e as expressionReader } from "./expression-reader-D_oDuUvA.js";
import { o as operationProcessor } from "./operation-processor-D2Wlskad.js";
import { t as typeReader } from "./type-reader-BgLSKYrq.js";
function declareBeans() {
  declareBean({
    name: "AdditionProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./addition-processor-BaDMccDb.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9]) : void 0, import.meta.url),
    factory: (m, deps) => new m.AdditionProcessor(...deps)
  });
  declareBean({
    name: "AssignmentProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./assignment-processor-DNbn0FNJ.js"), true ? __vite__mapDeps([10,1,2,11,4,5,8,9]) : void 0, import.meta.url),
    factory: (m, deps) => new m.AssignmentProcessor(...deps)
  });
  declareBean({
    name: "CgAssignmentProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./cg-assignment-processor-Cj8hzQje.js"), true ? __vite__mapDeps([12,11,4,5,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.CgAssignmentProcessor(...deps)
  });
  declareBean({
    name: "StringConcatProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./string-concat-processor-tj3KgkdO.js"), true ? __vite__mapDeps([13,3,4,5,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StringConcatProcessor(...deps)
  });
}
export {
  declareBeans
};
