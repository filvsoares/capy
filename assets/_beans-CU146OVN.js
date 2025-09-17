const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./argument-reader-impl-HYkDmHbo.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css","./identifier-D67RqHyN.js","./token-BtqAZLUf.js","./operator-BvOOTirp.js","./separator-DUrKHX5w.js","./callable-type-reader-impl-DRYh-zUT.js","./callable-type-s2fF9DZ6.js","./type-CXsu6tPh.js","./token-reader-CWKbD-VP.js","./bracket-DyCPjpk6.js","./simple-type-CKDhUhFe.js","./method-call-processor-Cc_p_f9s.js","./method-call-BIQmAUv-.js","./operation-Ow9MKkNb.js","./expression-I5NqfmRI.js","./method-parser-check-DbM5vYGM.js","./method-DxMFOSUf.js","./symbol-CzSKJU1d.js","./method-reader-DYCll-pB.js","./capy-method-nd2WbOy_.js","./local-variable-DlAa15h1.js","./method-data-DniYLBB_.js","./extra-Dqv87a62.js","./keyword-BPOLCCDh.js","./method-identifier-resolver-BvSjRmg0.js","./method-literal-CsR4Jik3.js","./return-statement-reader-DHlUhRke.js","./return-statement-CmD9meXP.js","./statement-D1Z7utbn.js","./local-variable-identifier-resolver-BuON75M8.js","./local-variable-reference-D6yAfqLR.js","./local-variable-statement-handler-DzNDNqhx.js","./assignment-sxxYQsme.js","./expression-statement-DV-fZMAI.js","./local-variable-reference-processor-D1eYo4ao.js","./cg-method-data-D1Uf3f84.js","./cg-method-call-processor-BajKvj8V.js","./method-extra-writer-CPlt1JtV.js","./method-literal-processor-yTvBs-TO.js","./method-symbol-processor-CScfxaoi.js","./return-statement-processor-DYkj52vO.js"])))=>i.map(i=>d[i]);
import { a as declareBeanInterface, d as declareBean, s as single, _ as __vitePreload, p as parser } from "./index-3ZiCjh5_.js";
import { c as codegenHook } from "./codegen-hook-DRVPHsty.js";
import { s as symbolProcessor } from "./symbol-processor-BHpaDr0V.js";
import { e as expressionItemProcessor } from "./expression-item-processor-C9t-ZVl3.js";
import { e as expressionProcessor } from "./expression-processor-_k5xIL4f.js";
import { e as expressionReader } from "./expression-reader-CID0cSEz.js";
import { i as identifierResolver } from "./identifier-resolver-drQlUuY0.js";
import { o as operationProcessor } from "./operation-processor-C_Lxwvu1.js";
import { c as callableTypeReader } from "./callable-type-reader-DQBsxHfX.js";
import { p as parserHook } from "./parser-hook-BhQsYzCC.js";
import { t as toplevelReader } from "./toplevel-reader-DaGaKSjK.js";
import { s as statementReader, a as statementItemReader, b as statementProcessor, c as statementItemProcessor } from "./statement-reader-B3-P9cu7.js";
import { t as typeItemReader } from "./type-item-reader-C9xHfki5.js";
import { t as typeReader } from "./type-reader-CTcnhb90.js";
const argumentReader = declareBeanInterface("ArgumentReader");
function declareBeans() {
  declareBean({
    name: "ArgumentReaderImpl",
    provides: [argumentReader],
    dependencies: [single(typeReader)],
    loadModule: () => __vitePreload(() => import("./argument-reader-impl-HYkDmHbo.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ArgumentReaderImpl(...deps)
  });
  declareBean({
    name: "CallableTypeReaderImpl",
    provides: [typeItemReader, callableTypeReader],
    dependencies: [single(typeReader), single(argumentReader)],
    loadModule: () => __vitePreload(() => import("./callable-type-reader-impl-DRYh-zUT.js"), true ? __vite__mapDeps([7,1,2,8,9,10,11,4,12,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.CallableTypeReaderImpl(...deps)
  });
  declareBean({
    name: "MethodCallProcessor",
    provides: [operationProcessor],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./method-call-processor-Cc_p_f9s.js"), true ? __vite__mapDeps([13,1,2,8,9,14,15,16,10,11,4]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodCallProcessor(...deps)
  });
  declareBean({
    name: "MethodParserCheck",
    provides: [parserHook],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-parser-check-DbM5vYGM.js"), true ? __vite__mapDeps([17,18,19,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodParserCheck(...deps)
  });
  declareBean({
    name: "MethodReader",
    provides: [toplevelReader],
    dependencies: [single(statementReader), single(callableTypeReader), single(parser)],
    loadModule: () => __vitePreload(() => import("./method-reader-DYCll-pB.js"), true ? __vite__mapDeps([20,1,2,21,22,18,19,23,24,10,11,4,3,25]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodReader(...deps)
  });
  declareBean({
    name: "MethodReferenceProcessor",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./method-identifier-resolver-BvSjRmg0.js"), true ? __vite__mapDeps([26,18,19,1,2,27,16]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodIdentifierResolver(...deps)
  });
  declareBean({
    name: "ReturnStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./return-statement-reader-DHlUhRke.js"), true ? __vite__mapDeps([28,1,2,23,24,29,30,25,4,12,9,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ReturnStatementReader(...deps)
  });
  declareBean({
    name: "LocalVariableIdentifierResolver",
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./local-variable-identifier-resolver-BuON75M8.js"), true ? __vite__mapDeps([31,32,16,1,2,23,24]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableIdentifierResolver(...deps)
  });
  declareBean({
    name: "LocalVariableStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => __vitePreload(() => import("./local-variable-statement-handler-DzNDNqhx.js"), true ? __vite__mapDeps([33,1,2,22,32,16,23,24,34,15,35,30,3,4,25,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableStatementReader(...deps)
  });
  declareBean({
    name: "LocalVariableReferenceProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./local-variable-reference-processor-D1eYo4ao.js"), true ? __vite__mapDeps([36,37,24,32,16,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LocalVariableReferenceProcessor(...deps)
  });
  declareBean({
    name: "MethodCallProcessor",
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./cg-method-call-processor-BajKvj8V.js"), true ? __vite__mapDeps([38,14,15,16,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodCallProcessor(...deps)
  });
  declareBean({
    name: "MethodExtraWriter",
    provides: [codegenHook],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-extra-writer-CPlt1JtV.js"), true ? __vite__mapDeps([39,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodExtraWriter(...deps)
  });
  declareBean({
    name: "MethodLiteralProcessor",
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./method-literal-processor-yTvBs-TO.js"), true ? __vite__mapDeps([40,27,16,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodLiteralProcessor(...deps)
  });
  declareBean({
    name: "MethodSymbolProcessor",
    provides: [symbolProcessor],
    dependencies: [single(statementProcessor)],
    loadModule: () => __vitePreload(() => import("./method-symbol-processor-CScfxaoi.js"), true ? __vite__mapDeps([41,21,22,1,2,18,19,37,24]) : void 0, import.meta.url),
    factory: (m, deps) => new m.MethodSymbolProcessor(...deps)
  });
  declareBean({
    name: "ReturnStatementProcessor",
    provides: [statementItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./return-statement-processor-DYkj52vO.js"), true ? __vite__mapDeps([42,29,30,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ReturnStatementProcessor(...deps)
  });
}
export {
  declareBeans
};
