const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./library-use-provider-Bio0WSLU.js","./library-B5fsabsH.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css","./native-method-reader-C4wNz8ie.js","./native-method-CnC8C1vy.js","./method-DxMFOSUf.js","./symbol-CzSKJU1d.js","./identifier-D67RqHyN.js","./token-BtqAZLUf.js","./keyword-BPOLCCDh.js","./separator-DUrKHX5w.js","./native-method-symbol-processor-Cm6BuBjm.js","./extra-Dqv87a62.js","./library-runner-args-provider-ZuyFylpm.js"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload, s as single } from "./index-3ZiCjh5_.js";
import { c as codegenHook } from "./codegen-hook-DRVPHsty.js";
import { s as symbolProcessor } from "./symbol-processor-BHpaDr0V.js";
import { c as callableTypeReader } from "./callable-type-reader-DQBsxHfX.js";
import { t as toplevelReader } from "./toplevel-reader-DaGaKSjK.js";
import { r as runnerArgsProvider } from "./runner-args-provider-Cl0TNDRe.js";
import { u as useProvider } from "./use-provider-B63FQBKY.js";
function declareBeans() {
  declareBean({
    name: "LibraryUseProvider",
    provides: [useProvider],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./library-use-provider-Bio0WSLU.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LibraryUseProvider(...deps)
  });
  declareBean({
    name: "NativeMethodReader",
    provides: [toplevelReader],
    dependencies: [single(callableTypeReader)],
    loadModule: () => __vitePreload(() => import("./native-method-reader-C4wNz8ie.js"), true ? __vite__mapDeps([4,2,3,5,6,7,8,9,10,11]) : void 0, import.meta.url),
    factory: (m, deps) => new m.NativeMethodReader(...deps)
  });
  declareBean({
    name: "NativeMethodSymbolProcessor",
    provides: [symbolProcessor, codegenHook],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./native-method-symbol-processor-Cm6BuBjm.js"), true ? __vite__mapDeps([12,13,5,6,7,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.NativeMethodSymbolProcessor(...deps)
  });
  declareBean({
    name: "LibraryRunnerArgsProvider",
    provides: [runnerArgsProvider],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./library-runner-args-provider-ZuyFylpm.js"), true ? __vite__mapDeps([14,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LibraryRunnerArgsProvider(...deps)
  });
}
export {
  declareBeans
};
