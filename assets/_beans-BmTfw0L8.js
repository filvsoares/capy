const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./library-use-provider-D-mLkdLA.js","./library-Bd1ZY2BO.js","./index-BPYk8cqz.js","./index-DW4arCFm.css","./native-method-reader-DQs7odBY.js","./native-method-DqWFp_RS.js","./method-DkaTFuoM.js","./symbol-CAVyxDMA.js","./identifier-ClyZKQs9.js","./token-C93Hpdaz.js","./keyword-D76bTD-h.js","./separator-BWSZyVah.js","./native-method-symbol-processor-B3z7McrG.js","./extra-Dqv87a62.js","./library-runner-args-provider-PrTxSvV5.js"])))=>i.map(i=>d[i]);
import { d as declareBean, _ as __vitePreload, s as single } from "./index-BPYk8cqz.js";
import { c as codegenHook } from "./codegen-hook--dazqpcx.js";
import { s as symbolProcessor } from "./symbol-processor-DHeSh7rf.js";
import { c as callableTypeReader } from "./callable-type-reader-BVQmPZHd.js";
import { t as toplevelReader } from "./toplevel-reader-BHpi2gM1.js";
import { r as runnerArgsProvider } from "./runner-args-provider-CMwXSIvb.js";
import { u as useProvider } from "./use-provider-DCNkK9BI.js";
function declareBeans() {
  declareBean({
    name: "LibraryUseProvider",
    provides: [useProvider],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./library-use-provider-D-mLkdLA.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LibraryUseProvider(...deps)
  });
  declareBean({
    name: "NativeMethodReader",
    provides: [toplevelReader],
    dependencies: [single(callableTypeReader)],
    loadModule: () => __vitePreload(() => import("./native-method-reader-DQs7odBY.js"), true ? __vite__mapDeps([4,2,3,5,6,7,8,9,10,11]) : void 0, import.meta.url),
    factory: (m, deps) => new m.NativeMethodReader(...deps)
  });
  declareBean({
    name: "NativeMethodSymbolProcessor",
    provides: [symbolProcessor, codegenHook],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./native-method-symbol-processor-B3z7McrG.js"), true ? __vite__mapDeps([12,13,5,6,7,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.NativeMethodSymbolProcessor(...deps)
  });
  declareBean({
    name: "LibraryRunnerArgsProvider",
    provides: [runnerArgsProvider],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./library-runner-args-provider-PrTxSvV5.js"), true ? __vite__mapDeps([14,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.LibraryRunnerArgsProvider(...deps)
  });
}
export {
  declareBeans
};
