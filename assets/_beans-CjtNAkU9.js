const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./global-variable-reader-CjKE0kbD.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css","./global-variable-DI-dNkiR.js","./symbol-CzSKJU1d.js","./token-reader-CWKbD-VP.js","./identifier-D67RqHyN.js","./token-BtqAZLUf.js","./keyword-BPOLCCDh.js","./operator-BvOOTirp.js","./separator-DUrKHX5w.js","./global-variable-identifier-resolver-BcjYR5bv.js","./global-variable-reference-Br-KxSDb.js","./expression-I5NqfmRI.js","./global-variable-reference-processor-CDm9Em5d.js","./cg-dereference-Civ58NKr.js","./extra-Dqv87a62.js","./global-variable-symbol-processor-rbCTw69H.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, p as parser } from "./index-3ZiCjh5_.js";
import { s as symbolProcessor } from "./symbol-processor-BHpaDr0V.js";
import { e as expressionItemProcessor } from "./expression-item-processor-C9t-ZVl3.js";
import { e as expressionProcessor } from "./expression-processor-_k5xIL4f.js";
import { e as expressionReader } from "./expression-reader-CID0cSEz.js";
import { i as identifierResolver } from "./identifier-resolver-drQlUuY0.js";
import { t as toplevelReader } from "./toplevel-reader-DaGaKSjK.js";
import { t as typeReader } from "./type-reader-CTcnhb90.js";
function declareBeans() {
  declareBean({
    name: "GlobalVariableReader",
    provides: [toplevelReader],
    dependencies: [single(typeReader), single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./global-variable-reader-CjKE0kbD.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableReader(...deps)
  });
  declareBean({
    name: "GlobalVariableIdentifierResolver",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./global-variable-identifier-resolver-BcjYR5bv.js"), true ? __vite__mapDeps([11,3,4,1,2,12,13]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableIdentifierResolver(...deps)
  });
  declareBean({
    name: "GlobalVariableReferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./global-variable-reference-processor-CDm9Em5d.js"), true ? __vite__mapDeps([14,15,16,12,13,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableReferenceProcessor(...deps)
  });
  declareBean({
    name: "GlobalVariableSymbolProcessor",
    provides: [symbolProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./global-variable-symbol-processor-rbCTw69H.js"), true ? __vite__mapDeps([17,3,4,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.GlobalVariableSymbolProcessor(...deps)
  });
}
export {
  declareBeans
};
