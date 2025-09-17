const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./library-use-provider-DNzsMPGh.js","./library-Be0wFXzF.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css","./native-method-reader-DpOyr36z.js","./native-method-Bk5GnIMw.js","./method-7GHRjHkK.js","./symbol-B09mnHSj.js","./identifier-DiJZGL4m.js","./token-ofOFEBrc.js","./keyword-DRNOSLz1.js","./separator-DxWjJeA5.js","./native-method-symbol-processor-sGIJUlvD.js","./extra-Dqv87a62.js","./library-runner-args-provider-qmDaW4Y1.js"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload, s as single } from "./index-DyTq3Mxn.js";
import { c as codegenHook } from "./codegen-hook-PMV6UFv2.js";
import { s as symbolProcessor } from "./symbol-processor-TWQTEQy9.js";
import { c as callableTypeReader } from "./callable-type-reader-CHAWhWqV.js";
import { t as toplevelReader } from "./toplevel-reader-BMha_raw.js";
import { r as runnerArgsProvider } from "./runner-args-provider-DNwi-xSl.js";
import { u as useProvider } from "./use-provider-Mt4SMmyo.js";
function declareBeans() {
  declareBean({
    name: "LibraryUseProvider",
    provides: [useProvider],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./library-use-provider-DNzsMPGh.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LibraryUseProvider(...deps)
  });
  declareBean({
    name: "NativeMethodReader",
    provides: [toplevelReader],
    dependencies: [single(callableTypeReader)],
    loadModule: () => __vitePreload(() => import("./native-method-reader-DpOyr36z.js"), true ? __vite__mapDeps([4,2,3,5,6,7,8,9,10,11]) : void 0, import.meta.url),
    factory: (m, deps) => new m.NativeMethodReader(...deps)
  });
  declareBean({
    name: "NativeMethodSymbolProcessor",
    provides: [symbolProcessor, codegenHook],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./native-method-symbol-processor-sGIJUlvD.js"), true ? __vite__mapDeps([12,13,5,6,7,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.NativeMethodSymbolProcessor(...deps)
  });
  declareBean({
    name: "LibraryRunnerArgsProvider",
    provides: [runnerArgsProvider],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./library-runner-args-provider-qmDaW4Y1.js"), true ? __vite__mapDeps([14,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LibraryRunnerArgsProvider(...deps)
  });
}
export {
  declareBeans
};
