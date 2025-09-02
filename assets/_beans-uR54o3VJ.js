const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./global-variable-reader-DuFudz82.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./global-variable-B4sLCCmC.js","./symbol-CzF83rwI.js","./identifier-CQkte7dE.js","./token-YbVOofIc.js","./keyword-DP2VjTYJ.js","./operator-CJR6HJ2X.js","./separator-D1CNARzn.js","./global-variable-identifier-resolver-C6eFMUAw.js","./global-variable-reference-TbOEZYtv.js","./expression-DdT-ttwU.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, p as parser } from "./index-BncJlCxS.js";
import { e as expressionReader } from "./expression-reader-BjAhtLB3.js";
import { i as identifierResolver } from "./identifier-resolver-CosOBN9u.js";
import { t as toplevelReader } from "./toplevel-reader-B2NtgcHG.js";
import { t as typeReader } from "./type-reader-DO2kSkWN.js";
function declareBeans() {
  declareBean({
    name: "GlobalVariableReader",
    provides: [toplevelReader],
    dependencies: [single(typeReader), single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./global-variable-reader-DuFudz82.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableReader(...deps)
  });
  declareBean({
    name: "GlobalVariableIdentifierResolver",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./global-variable-identifier-resolver-C6eFMUAw.js"), true ? __vite__mapDeps([10,3,4,1,2,11,12]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableIdentifierResolver(...deps)
  });
}
export {
  declareBeans
};
