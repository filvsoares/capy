const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./parser-impl-BWIO-gul.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./symbol-CzF83rwI.js","./token-reader-BG65ZNxm.js","./context-ByTyzBz7.js"])))=>i.map(i=>d[i]);
import { d as declareBean, p as parser, s as single, l as list, _ as __vitePreload } from "./index-BncJlCxS.js";
import { p as parserCheck } from "./parser-check-CWxM2Kt0.js";
import { t as toplevelReader } from "./toplevel-reader-B2NtgcHG.js";
import { t as tokenizer } from "./tokenizer-BDWh0F-K.js";
function declareBeans() {
  declareBean({
    name: "ParserImpl",
    provides: [parser],
    dependencies: [single(tokenizer), list(toplevelReader), list(parserCheck)],
    loadModule: () => __vitePreload(() => import("./parser-impl-BWIO-gul.js"), true ? __vite__mapDeps([0,1,2,3,4,5]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ParserImpl(...deps)
  });
}
export {
  declareBeans
};
