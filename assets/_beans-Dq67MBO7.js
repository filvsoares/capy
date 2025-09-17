const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./parser-impl-DpsGsQ97.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css","./symbol-CzSKJU1d.js","./token-reader-CWKbD-VP.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, l as list, p as parser, _ as __vitePreload } from "./index-3ZiCjh5_.js";
import { p as parserHook } from "./parser-hook-BhQsYzCC.js";
import { t as toplevelReader } from "./toplevel-reader-DaGaKSjK.js";
import { t as tokenizer } from "./tokenizer-1BH-GwZp.js";
function declareBeans() {
  declareBean({
    name: "ParserImpl",
    provides: [parser],
    dependencies: [single(tokenizer), list(toplevelReader), list(parserHook)],
    loadModule: () => __vitePreload(() => import("./parser-impl-DpsGsQ97.js"), true ? __vite__mapDeps([0,1,2,3,4]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ParserImpl(...deps)
  });
}
export {
  declareBeans
};
