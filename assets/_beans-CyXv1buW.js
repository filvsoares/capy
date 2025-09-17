const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./global-variable-reader-I4r50e1x.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css","./global-variable-DviImPNW.js","./symbol-B09mnHSj.js","./token-reader-CWKbD-VP.js","./identifier-DiJZGL4m.js","./token-ofOFEBrc.js","./keyword-DRNOSLz1.js","./operator-D6f5KmIA.js","./separator-DxWjJeA5.js","./global-variable-identifier-resolver-eCQx6jMz.js","./global-variable-reference-drp9uP7U.js","./expression-BI_7gns1.js","./global-variable-reference-processor-BN5g5uyK.js","./cg-dereference-Civ58NKr.js","./extra-Dqv87a62.js","./global-variable-symbol-processor-BJsM6qB6.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, p as parser } from "./index-DyTq3Mxn.js";
import { s as symbolProcessor } from "./symbol-processor-TWQTEQy9.js";
import { e as expressionItemProcessor } from "./expression-item-processor-u9WVjWwB.js";
import { e as expressionProcessor } from "./expression-processor-DQ-gQ6lR.js";
import { e as expressionReader } from "./expression-reader-D_oDuUvA.js";
import { i as identifierResolver } from "./identifier-resolver-CZD0pzuw.js";
import { t as toplevelReader } from "./toplevel-reader-BMha_raw.js";
import { t as typeReader } from "./type-reader-BgLSKYrq.js";
function declareBeans() {
  declareBean({
    name: "GlobalVariableReader",
    provides: [toplevelReader],
    dependencies: [single(typeReader), single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./global-variable-reader-I4r50e1x.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableReader(...deps)
  });
  declareBean({
    name: "GlobalVariableIdentifierResolver",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./global-variable-identifier-resolver-eCQx6jMz.js"), true ? __vite__mapDeps([11,3,4,1,2,12,13]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableIdentifierResolver(...deps)
  });
  declareBean({
    name: "GlobalVariableReferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./global-variable-reference-processor-BN5g5uyK.js"), true ? __vite__mapDeps([14,15,16,12,13,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableReferenceProcessor(...deps)
  });
  declareBean({
    name: "GlobalVariableSymbolProcessor",
    provides: [symbolProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./global-variable-symbol-processor-BJsM6qB6.js"), true ? __vite__mapDeps([17,3,4,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableSymbolProcessor(...deps)
  });
}
export {
  declareBeans
};
