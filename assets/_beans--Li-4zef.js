const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./argument-reader-impl-BClTdO-x.js","./index-BPYk8cqz.js","./index-DW4arCFm.css","./identifier-ClyZKQs9.js","./token-C93Hpdaz.js","./operator-BNRdXr0O.js","./separator-BWSZyVah.js","./callable-type-reader-impl-BMbR8Myb.js","./callable-type-BbVAEoh2.js","./type-Dxgg9cQE.js","./token-reader-CWKbD-VP.js","./bracket-CET9I_Ke.js","./simple-type-KY6tNXlF.js","./method-call-processor-5-3BQpFQ.js","./method-call-BWqwrHQi.js","./operation-ClDvK6AF.js","./expression-gX919Tzj.js","./method-parser-check-DDUOKs-B.js","./method-DkaTFuoM.js","./symbol-CAVyxDMA.js","./method-reader-DLK8Ngiz.js","./capy-method-BPyyA8yv.js","./local-variable-B09Bv3_O.js","./method-data-DniYLBB_.js","./extra-Dqv87a62.js","./keyword-D76bTD-h.js","./method-identifier-resolver-BJMyCGxD.js","./method-literal-zZT4y-pX.js","./return-statement-reader-ByVXTjFJ.js","./return-statement-DG-Gi2ZG.js","./statement-eXuGN2Ox.js","./local-variable-identifier-resolver-CMLVbTx_.js","./local-variable-reference-DRLazM8o.js","./local-variable-statement-handler-Bq1Z3aTO.js","./assignment-CN3cZpvq.js","./expression-statement-BS8iaRiv.js","./local-variable-reference-processor-7Yv_OMJY.js","./cg-method-data-D1Uf3f84.js","./cg-method-call-processor-QO2hRrXl.js","./method-extra-writer-CqMZkn9w.js","./method-literal-processor-BgK7gpL9.js","./method-symbol-processor-BE_mehHP.js","./return-statement-processor-Dqsjf2Ql.js"])))=>i.map(i=>d[i]);
import { a as declareBeanInterface, d as declareBean, s as single, _ as __vitePreload, p as parser } from "./index-BPYk8cqz.js";
import { c as codegenHook } from "./codegen-hook--dazqpcx.js";
import { s as symbolProcessor } from "./symbol-processor-DHeSh7rf.js";
import { e as expressionItemProcessor } from "./expression-item-processor-D6en1Vpj.js";
import { e as expressionProcessor } from "./expression-processor-CSzvSGPX.js";
import { e as expressionReader } from "./expression-reader-Ns-x8iIn.js";
import { i as identifierResolver } from "./identifier-resolver-BbtMg5Hh.js";
import { o as operationProcessor } from "./operation-processor-KGcHwoWg.js";
import { c as callableTypeReader } from "./callable-type-reader-BVQmPZHd.js";
import { p as parserHook } from "./parser-hook-7zgatCsX.js";
import { t as toplevelReader } from "./toplevel-reader-BHpi2gM1.js";
import { s as statementReader, a as statementItemReader, b as statementProcessor, c as statementItemProcessor } from "./statement-reader-rsljpUVH.js";
import { t as typeItemReader } from "./type-item-reader-C8Z2XXud.js";
import { t as typeReader } from "./type-reader-BsMihJ1-.js";
const argumentReader = declareBeanInterface("ArgumentReader");
function declareBeans() {
  declareBean({
    name: "ArgumentReaderImpl",
    provides: [argumentReader],
    dependencies: [single(typeReader)],
    loadModule: () => __vitePreload(() => import("./argument-reader-impl-BClTdO-x.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ArgumentReaderImpl(...deps)
  });
  declareBean({
    name: "CallableTypeReaderImpl",
    provides: [typeItemReader, callableTypeReader],
    dependencies: [single(typeReader), single(argumentReader)],
    loadModule: () => __vitePreload(() => import("./callable-type-reader-impl-BMbR8Myb.js"), true ? __vite__mapDeps([7,1,2,8,9,10,11,4,12,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.CallableTypeReaderImpl(...deps)
  });
  declareBean({
    name: "MethodCallProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./method-call-processor-5-3BQpFQ.js"), true ? __vite__mapDeps([13,1,2,8,9,14,15,16,10,11,4]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodCallProcessor(...deps)
  });
  declareBean({
    name: "MethodParserCheck",
    provides: [parserHook],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-parser-check-DDUOKs-B.js"), true ? __vite__mapDeps([17,18,19,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodParserCheck(...deps)
  });
  declareBean({
    name: "MethodReader",
    provides: [toplevelReader],
    dependencies: [single(statementReader), single(callableTypeReader), single(parser)],
    loadModule: () => __vitePreload(() => import("./method-reader-DLK8Ngiz.js"), true ? __vite__mapDeps([20,1,2,21,22,18,19,23,24,10,11,4,3,25]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodReader(...deps)
  });
  declareBean({
    name: "MethodReferenceProcessor",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./method-identifier-resolver-BJMyCGxD.js"), true ? __vite__mapDeps([26,18,19,1,2,27,16]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodIdentifierResolver(...deps)
  });
  declareBean({
    name: "ReturnStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./return-statement-reader-ByVXTjFJ.js"), true ? __vite__mapDeps([28,1,2,23,24,29,30,25,4,12,9,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ReturnStatementReader(...deps)
  });
  declareBean({
    name: "LocalVariableIdentifierResolver",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./local-variable-identifier-resolver-CMLVbTx_.js"), true ? __vite__mapDeps([31,32,16,1,2,23,24]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableIdentifierResolver(...deps)
  });
  declareBean({
    name: "LocalVariableStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./local-variable-statement-handler-Bq1Z3aTO.js"), true ? __vite__mapDeps([33,1,2,22,32,16,23,24,34,15,35,30,3,4,25,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableStatementReader(...deps)
  });
  declareBean({
    name: "LocalVariableReferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./local-variable-reference-processor-7Yv_OMJY.js"), true ? __vite__mapDeps([36,37,24,32,16,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableReferenceProcessor(...deps)
  });
  declareBean({
    name: "MethodCallProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./cg-method-call-processor-QO2hRrXl.js"), true ? __vite__mapDeps([38,14,15,16,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodCallProcessor(...deps)
  });
  declareBean({
    name: "MethodExtraWriter",
    provides: [codegenHook],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-extra-writer-CqMZkn9w.js"), true ? __vite__mapDeps([39,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodExtraWriter(...deps)
  });
  declareBean({
    name: "MethodLiteralProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-literal-processor-BgK7gpL9.js"), true ? __vite__mapDeps([40,27,16,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodLiteralProcessor(...deps)
  });
  declareBean({
    name: "MethodSymbolProcessor",
    provides: [symbolProcessor],
    dependencies: [single(statementProcessor)],
    loadModule: () => __vitePreload(() => import("./method-symbol-processor-BE_mehHP.js"), true ? __vite__mapDeps([41,21,22,1,2,18,19,37,24]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodSymbolProcessor(...deps)
  });
  declareBean({
    name: "ReturnStatementProcessor",
    provides: [statementItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./return-statement-processor-Dqsjf2Ql.js"), true ? __vite__mapDeps([42,29,30,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ReturnStatementProcessor(...deps)
  });
}
export {
  declareBeans
};
