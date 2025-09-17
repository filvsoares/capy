const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./global-variable-reader-7Qc-Lx1L.js","./index-BPYk8cqz.js","./index-DW4arCFm.css","./global-variable-CUKWfMi2.js","./symbol-CAVyxDMA.js","./token-reader-CWKbD-VP.js","./identifier-ClyZKQs9.js","./token-C93Hpdaz.js","./keyword-D76bTD-h.js","./operator-BNRdXr0O.js","./separator-BWSZyVah.js","./global-variable-identifier-resolver-DQrmU03r.js","./global-variable-reference-DDCmF-Z4.js","./expression-gX919Tzj.js","./global-variable-reference-processor-CswkblrD.js","./cg-dereference-Civ58NKr.js","./extra-Dqv87a62.js","./global-variable-symbol-processor-vhwEL3I_.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, p as parser } from "./index-BPYk8cqz.js";
import { s as symbolProcessor } from "./symbol-processor-DHeSh7rf.js";
import { e as expressionItemProcessor } from "./expression-item-processor-D6en1Vpj.js";
import { e as expressionProcessor } from "./expression-processor-CSzvSGPX.js";
import { e as expressionReader } from "./expression-reader-Ns-x8iIn.js";
import { i as identifierResolver } from "./identifier-resolver-BbtMg5Hh.js";
import { t as toplevelReader } from "./toplevel-reader-BHpi2gM1.js";
import { t as typeReader } from "./type-reader-BsMihJ1-.js";
function declareBeans() {
  declareBean({
    name: "GlobalVariableReader",
    provides: [toplevelReader],
    dependencies: [single(typeReader), single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./global-variable-reader-7Qc-Lx1L.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableReader(...deps)
  });
  declareBean({
    name: "GlobalVariableIdentifierResolver",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./global-variable-identifier-resolver-DQrmU03r.js"), true ? __vite__mapDeps([11,3,4,1,2,12,13]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableIdentifierResolver(...deps)
  });
  declareBean({
    name: "GlobalVariableReferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./global-variable-reference-processor-CswkblrD.js"), true ? __vite__mapDeps([14,15,16,12,13,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableReferenceProcessor(...deps)
  });
  declareBean({
    name: "GlobalVariableSymbolProcessor",
    provides: [symbolProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./global-variable-symbol-processor-vhwEL3I_.js"), true ? __vite__mapDeps([17,3,4,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableSymbolProcessor(...deps)
  });
}
export {
  declareBeans
};
