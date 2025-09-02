const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./local-variable-reference-processor-DnlWHv9N.js","./method-data-CGRmJbpc.js","./local-variable-reference-CbLeQCuI.js","./expression-DdT-ttwU.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./method-call-processor-78pIRHZu.js","./method-call-Dk84_5LW.js","./operation-DtccBRam.js","./method-extra-writer-BfDDzSKl.js","./method-literal-processor-DiQ-EEY3.js","./method-literal-C8E8mbKA.js","./method-symbol-processor-C3IkhdVj.js","./native-method-BGvMDny2.js","./local-variable-CyCoFzWG.js","./method-vXMUZt8y.js","./symbol-CzF83rwI.js","./return-statement-processor-CZTYrvBa.js","./return-statement-DSXc-g5D.js","./statement-BEQNu2Pd.js"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload, s as single } from "./index-BncJlCxS.js";
import { c as codegenExtraWriter } from "./codegen-extra-writer-D1Ah2Ft-.js";
import { s as symbolProcessor } from "./symbol-processor-CQBUj8aa.js";
import { e as expressionItemProcessor } from "./expression-item-processor-UKu1INDX.js";
import { e as expressionProcessor } from "./expression-processor-cB5RnEiF.js";
import { s as statementProcessor, a as statementItemProcessor } from "./statement-processor-BcNMfN4f.js";
function declareBeans() {
  declareBean({
    name: "LocalVariableReferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./local-variable-reference-processor-DnlWHv9N.js"), true ? __vite__mapDeps([0,1,2,3,4,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableReferenceProcessor(...deps)
  });
  declareBean({
    name: "MethodCallProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./method-call-processor-78pIRHZu.js"), true ? __vite__mapDeps([6,7,8,3,4,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodCallProcessor(...deps)
  });
  declareBean({
    name: "MethodCallProcessor",
    provides: [codegenExtraWriter],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-extra-writer-BfDDzSKl.js"), true ? __vite__mapDeps([9,4,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodExtraWriter(...deps)
  });
  declareBean({
    name: "MethodLiteralProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-literal-processor-DiQ-EEY3.js"), true ? __vite__mapDeps([10,11,3,4,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodLiteralProcessor(...deps)
  });
  declareBean({
    name: "MethodSymbolProcessor",
    provides: [symbolProcessor],
    dependencies: [single(statementProcessor)],
    loadModule: () => __vitePreload(() => import("./method-symbol-processor-C3IkhdVj.js"), true ? __vite__mapDeps([12,1,13,14,4,5,15,16]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodSymbolProcessor(...deps)
  });
  declareBean({
    name: "ReturnStatementProcessor",
    provides: [statementItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./return-statement-processor-CZTYrvBa.js"), true ? __vite__mapDeps([17,18,19,4,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ReturnStatementProcessor(...deps)
  });
}
export {
  declareBeans
};
