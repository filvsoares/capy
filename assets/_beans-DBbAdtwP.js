const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./argument-reader-impl-D_DvYrT2.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./identifier-CQkte7dE.js","./token-YbVOofIc.js","./operator-CJR6HJ2X.js","./separator-D1CNARzn.js","./callable-type-reader-impl-CJB6Z2Q8.js","./callable-type-CCR6GTvr.js","./type-CuPJgnn0.js","./token-reader-BG65ZNxm.js","./bracket-BTNv1ZF5.js","./simple-type-BIm_59qh.js","./method-call-processor-Cc7mnSm-.js","./method-call-Dk84_5LW.js","./operation-DtccBRam.js","./expression-DdT-ttwU.js","./method-parser-check-CUk3yyoS.js","./method-vXMUZt8y.js","./symbol-CzF83rwI.js","./method-reader-DmzSt9Xs.js","./native-method-BGvMDny2.js","./local-variable-CyCoFzWG.js","./method-data-BJ-mjRhZ.js","./keyword-DP2VjTYJ.js","./method-identifier-resolver-CQKK8SiT.js","./method-literal-C8E8mbKA.js","./return-statement-reader-CjKXwhHy.js","./return-statement-DSXc-g5D.js","./statement-BEQNu2Pd.js","./local-variable-identifier-resolver-CIuQTIpH.js","./local-variable-reference-CbLeQCuI.js","./local-variable-statement-handler-C9GO8wM2.js","./assignment-eya3ith5.js","./expression-statement-DaAWbzNd.js"])))=>i.map(i=>d[i]);
import { a as declareBeanInterface, d as declareBean, s as single, _ as __vitePreload, p as parser } from "./index-BncJlCxS.js";
import { e as expressionReader } from "./expression-reader-BjAhtLB3.js";
import { i as identifierResolver } from "./identifier-resolver-CosOBN9u.js";
import { o as operationProcessor } from "./operation-processor-fPNiYi1t.js";
import { p as parserCheck } from "./parser-check-CWxM2Kt0.js";
import { t as toplevelReader } from "./toplevel-reader-B2NtgcHG.js";
import { s as statementReader, a as statementItemReader } from "./statement-reader-CEgcvo4S.js";
import { t as typeItemReader } from "./type-item-reader-CEV5cC_3.js";
import { t as typeReader } from "./type-reader-DO2kSkWN.js";
const argumentReader = declareBeanInterface("ArgumentReader");
const callableTypeReader = declareBeanInterface("CallableTypeReader");
function declareBeans() {
  declareBean({
    name: "ArgumentReaderImpl",
    provides: [argumentReader],
    dependencies: [single(typeReader)],
    loadModule: () => __vitePreload(() => import("./argument-reader-impl-D_DvYrT2.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ArgumentReaderImpl(...deps)
  });
  declareBean({
    name: "CallableTypeReaderImpl",
    provides: [typeItemReader, callableTypeReader],
    dependencies: [single(typeReader), single(argumentReader)],
    loadModule: () => __vitePreload(() => import("./callable-type-reader-impl-CJB6Z2Q8.js"), true ? __vite__mapDeps([7,8,9,1,2,10,11,4,12,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.CallableTypeReaderImpl(...deps)
  });
  declareBean({
    name: "MethodCallProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./method-call-processor-Cc7mnSm-.js"), true ? __vite__mapDeps([13,8,9,1,2,14,15,16,10,11,4]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodCallProcessor(...deps)
  });
  declareBean({
    name: "MethodParserCheck",
    provides: [parserCheck],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-parser-check-CUk3yyoS.js"), true ? __vite__mapDeps([17,18,19,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodParserCheck(...deps)
  });
  declareBean({
    name: "MethodReader",
    provides: [toplevelReader],
    dependencies: [single(statementReader), single(callableTypeReader), single(parser)],
    loadModule: () => __vitePreload(() => import("./method-reader-DmzSt9Xs.js"), true ? __vite__mapDeps([20,1,2,21,22,18,19,23,10,11,4,3,24,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodReader(...deps)
  });
  declareBean({
    name: "MethodReferenceProcessor",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./method-identifier-resolver-CQKK8SiT.js"), true ? __vite__mapDeps([25,18,19,1,2,26,16]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodIdentifierResolver(...deps)
  });
  declareBean({
    name: "ReturnStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./return-statement-reader-CjKXwhHy.js"), true ? __vite__mapDeps([27,1,2,23,28,29,24,4,12,9,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ReturnStatementReader(...deps)
  });
  declareBean({
    name: "LocalVariableIdentifierResolver",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./local-variable-identifier-resolver-CIuQTIpH.js"), true ? __vite__mapDeps([30,31,16,1,2,23]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableIdentifierResolver(...deps)
  });
  declareBean({
    name: "LocalVariableStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./local-variable-statement-handler-C9GO8wM2.js"), true ? __vite__mapDeps([32,1,2,22,31,16,23,33,15,34,29,3,4,24,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableStatementReader(...deps)
  });
}
export {
  declareBeans
};
