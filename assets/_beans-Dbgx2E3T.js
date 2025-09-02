const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./assignment-processor-ByFNlj-7.js","./assignment-eya3ith5.js","./operation-DtccBRam.js","./expression-DdT-ttwU.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./string-concat-processor-DBcjh568.js","./string-concat-D_mh4wUB.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload } from "./index-BncJlCxS.js";
import { e as expressionItemProcessor } from "./expression-item-processor-UKu1INDX.js";
import { e as expressionProcessor } from "./expression-processor-cB5RnEiF.js";
function declareBeans() {
  declareBean({
    name: "AssignmentProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./assignment-processor-ByFNlj-7.js"), true ? __vite__mapDeps([0,1,2,3,4,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.AssignmentProcessor(...deps)
  });
  declareBean({
    name: "StringConcatProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./string-concat-processor-DBcjh568.js"), true ? __vite__mapDeps([6,7,2,3,4,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StringConcatProcessor(...deps)
  });
}
export {
  declareBeans
};
