const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./argument-reader-impl-G9LBTCoB.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css","./identifier-DiJZGL4m.js","./token-ofOFEBrc.js","./operator-D6f5KmIA.js","./separator-DxWjJeA5.js","./callable-type-reader-impl-C5raiSjX.js","./callable-type-DOuZ7DUR.js","./type-Cw01Jon0.js","./token-reader-CWKbD-VP.js","./bracket-CzgbCMwV.js","./simple-type-DZbjR7se.js","./method-call-processor-B8JOw3hl.js","./method-call-IOoUtt-P.js","./operation-CGef310c.js","./expression-BI_7gns1.js","./method-parser-check-BeHG4sGz.js","./method-7GHRjHkK.js","./symbol-B09mnHSj.js","./method-reader-DATBLwuZ.js","./capy-method-as0YoVDD.js","./local-variable-C8xNbW3D.js","./method-data-DniYLBB_.js","./extra-Dqv87a62.js","./keyword-DRNOSLz1.js","./method-identifier-resolver-J_gnviaF.js","./method-literal-P21cpdxF.js","./return-statement-reader-DZBKUaHY.js","./return-statement-DA0w9-qL.js","./statement-1pRbB8Zx.js","./local-variable-identifier-resolver-DrYACPYl.js","./local-variable-reference-KLkPjCM3.js","./local-variable-statement-handler-CnJ0mXWr.js","./assignment-CPCbZnEw.js","./expression-statement-s9BqjCE-.js","./local-variable-reference-processor-3i7RjmXO.js","./cg-method-data-D1Uf3f84.js","./cg-method-call-processor-f2MoJStA.js","./method-extra-writer-DjjO_nLg.js","./method-literal-processor-DymsvaJU.js","./method-symbol-processor-BrqFVjdi.js","./return-statement-processor-D50bN3WN.js"])))=>i.map(i=>d[i]);
import { a as declareBeanInterface, d as declareBean, s as single, _ as __vitePreload, p as parser } from "./index-DyTq3Mxn.js";
import { c as codegenHook } from "./codegen-hook-PMV6UFv2.js";
import { s as symbolProcessor } from "./symbol-processor-TWQTEQy9.js";
import { e as expressionItemProcessor } from "./expression-item-processor-u9WVjWwB.js";
import { e as expressionProcessor } from "./expression-processor-DQ-gQ6lR.js";
import { e as expressionReader } from "./expression-reader-D_oDuUvA.js";
import { i as identifierResolver } from "./identifier-resolver-CZD0pzuw.js";
import { o as operationProcessor } from "./operation-processor-D2Wlskad.js";
import { c as callableTypeReader } from "./callable-type-reader-CHAWhWqV.js";
import { p as parserHook } from "./parser-hook-DQR4w9rn.js";
import { t as toplevelReader } from "./toplevel-reader-BMha_raw.js";
import { s as statementReader, a as statementItemReader, b as statementProcessor, c as statementItemProcessor } from "./statement-reader-DEl4Ch8T.js";
import { t as typeItemReader } from "./type-item-reader-NiAJqXja.js";
import { t as typeReader } from "./type-reader-BgLSKYrq.js";
const argumentReader = declareBeanInterface("ArgumentReader");
function declareBeans() {
  declareBean({
    name: "ArgumentReaderImpl",
    provides: [argumentReader],
    dependencies: [single(typeReader)],
    loadModule: () => __vitePreload(() => import("./argument-reader-impl-G9LBTCoB.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ArgumentReaderImpl(...deps)
  });
  declareBean({
    name: "CallableTypeReaderImpl",
    provides: [typeItemReader, callableTypeReader],
    dependencies: [single(typeReader), single(argumentReader)],
    loadModule: () => __vitePreload(() => import("./callable-type-reader-impl-C5raiSjX.js"), true ? __vite__mapDeps([7,1,2,8,9,10,11,4,12,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.CallableTypeReaderImpl(...deps)
  });
  declareBean({
    name: "MethodCallProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./method-call-processor-B8JOw3hl.js"), true ? __vite__mapDeps([13,1,2,8,9,14,15,16,10,11,4]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodCallProcessor(...deps)
  });
  declareBean({
    name: "MethodParserCheck",
    provides: [parserHook],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-parser-check-BeHG4sGz.js"), true ? __vite__mapDeps([17,18,19,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodParserCheck(...deps)
  });
  declareBean({
    name: "MethodReader",
    provides: [toplevelReader],
    dependencies: [single(statementReader), single(callableTypeReader), single(parser)],
    loadModule: () => __vitePreload(() => import("./method-reader-DATBLwuZ.js"), true ? __vite__mapDeps([20,1,2,21,22,18,19,23,24,10,11,4,3,25]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodReader(...deps)
  });
  declareBean({
    name: "MethodReferenceProcessor",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./method-identifier-resolver-J_gnviaF.js"), true ? __vite__mapDeps([26,18,19,1,2,27,16]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodIdentifierResolver(...deps)
  });
  declareBean({
    name: "ReturnStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./return-statement-reader-DZBKUaHY.js"), true ? __vite__mapDeps([28,1,2,23,24,29,30,25,4,12,9,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ReturnStatementReader(...deps)
  });
  declareBean({
    name: "LocalVariableIdentifierResolver",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./local-variable-identifier-resolver-DrYACPYl.js"), true ? __vite__mapDeps([31,32,16,1,2,23,24]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableIdentifierResolver(...deps)
  });
  declareBean({
    name: "LocalVariableStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./local-variable-statement-handler-CnJ0mXWr.js"), true ? __vite__mapDeps([33,1,2,22,32,16,23,24,34,15,35,30,3,4,25,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableStatementReader(...deps)
  });
  declareBean({
    name: "LocalVariableReferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./local-variable-reference-processor-3i7RjmXO.js"), true ? __vite__mapDeps([36,37,24,32,16,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableReferenceProcessor(...deps)
  });
  declareBean({
    name: "MethodCallProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./cg-method-call-processor-f2MoJStA.js"), true ? __vite__mapDeps([38,14,15,16,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodCallProcessor(...deps)
  });
  declareBean({
    name: "MethodExtraWriter",
    provides: [codegenHook],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-extra-writer-DjjO_nLg.js"), true ? __vite__mapDeps([39,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodExtraWriter(...deps)
  });
  declareBean({
    name: "MethodLiteralProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-literal-processor-DymsvaJU.js"), true ? __vite__mapDeps([40,27,16,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodLiteralProcessor(...deps)
  });
  declareBean({
    name: "MethodSymbolProcessor",
    provides: [symbolProcessor],
    dependencies: [single(statementProcessor)],
    loadModule: () => __vitePreload(() => import("./method-symbol-processor-BrqFVjdi.js"), true ? __vite__mapDeps([41,21,22,1,2,18,19,37,24]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodSymbolProcessor(...deps)
  });
  declareBean({
    name: "ReturnStatementProcessor",
    provides: [statementItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./return-statement-processor-D50bN3WN.js"), true ? __vite__mapDeps([42,29,30,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ReturnStatementProcessor(...deps)
  });
}
export {
  declareBeans
};
