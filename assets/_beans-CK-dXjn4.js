const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./parser-impl-Dda5Rz38.js","./index-BPYk8cqz.js","./index-DW4arCFm.css","./symbol-CAVyxDMA.js","./token-reader-CWKbD-VP.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, l as list, p as parser, _ as __vitePreload } from "./index-BPYk8cqz.js";
import { p as parserHook } from "./parser-hook-7zgatCsX.js";
import { t as toplevelReader } from "./toplevel-reader-BHpi2gM1.js";
import { t as tokenizer } from "./tokenizer-BepO_MWv.js";
function declareBeans() {
  declareBean({
    name: "ParserImpl",
    provides: [parser],
    dependencies: [single(tokenizer), list(toplevelReader), list(parserHook)],
    loadModule: () => __vitePreload(() => import("./parser-impl-Dda5Rz38.js"), true ? __vite__mapDeps([0,1,2,3,4]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ParserImpl(...deps)
  });
}
export {
  declareBeans
};
