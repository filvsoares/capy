const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./global-variable-reference-processor-DkQx0r6j.js","./dereference-Dg4sNnGm.js","./global-variable-reference-TbOEZYtv.js","./expression-DdT-ttwU.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./global-variable-symbol-processor-7JUjsPy1.js","./global-variable-B4sLCCmC.js","./symbol-CzF83rwI.js"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload, s as single } from "./index-BncJlCxS.js";
import { s as symbolProcessor } from "./symbol-processor-CQBUj8aa.js";
import { e as expressionItemProcessor } from "./expression-item-processor-UKu1INDX.js";
import { e as expressionProcessor } from "./expression-processor-cB5RnEiF.js";
function declareBeans() {
  declareBean({
    name: "GlobalVariableReferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./global-variable-reference-processor-DkQx0r6j.js"), true ? __vite__mapDeps([0,1,2,3,4,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableReferenceProcessor(...deps)
  });
  declareBean({
    name: "GlobalVariableSymbolProcessor",
    provides: [symbolProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./global-variable-symbol-processor-7JUjsPy1.js"), true ? __vite__mapDeps([6,7,8,4,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableSymbolProcessor(...deps)
  });
}
export {
  declareBeans
};
