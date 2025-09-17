const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./parser-impl-D2n_T7lr.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css","./symbol-B09mnHSj.js","./token-reader-CWKbD-VP.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, l as list, p as parser, _ as __vitePreload } from "./index-DyTq3Mxn.js";
import { p as parserHook } from "./parser-hook-DQR4w9rn.js";
import { t as toplevelReader } from "./toplevel-reader-BMha_raw.js";
import { t as tokenizer } from "./tokenizer-BrFqumHj.js";
function declareBeans() {
  declareBean({
    name: "ParserImpl",
    provides: [parser],
    dependencies: [single(tokenizer), list(toplevelReader), list(parserHook)],
    loadModule: () => __vitePreload(() => import("./parser-impl-D2n_T7lr.js"), true ? __vite__mapDeps([0,1,2,3,4]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ParserImpl(...deps)
  });
}
export {
  declareBeans
};
