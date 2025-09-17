const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./export-reader-Dm6wcKGw.js","./index-BPYk8cqz.js","./index-DW4arCFm.css","./symbol-CAVyxDMA.js","./keyword-D76bTD-h.js","./token-C93Hpdaz.js","./export-data-CwGovO6H.js","./extra-Dqv87a62.js","./imported-symbol-identifier-resolver-CEuR5loD.js","./use-reader-Ci9jogYq.js","./separator-BWSZyVah.js","./string-BMju32Tu.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, p as parser, _ as __vitePreload, l as list } from "./index-BPYk8cqz.js";
import { e as expressionReader } from "./expression-reader-Ns-x8iIn.js";
import { i as identifierResolver } from "./identifier-resolver-BbtMg5Hh.js";
import { p as parserHook } from "./parser-hook-7zgatCsX.js";
import { t as toplevelReader } from "./toplevel-reader-BHpi2gM1.js";
import { u as useProvider } from "./use-provider-DCNkK9BI.js";
function declareBeans() {
  declareBean({
    name: "ExportReader",
    provides: [toplevelReader, parserHook],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./export-reader-Dm6wcKGw.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExportReader(...deps)
  });
  declareBean({
    name: "ImportedSymbolIdentifierResolver",
    provides: [identifierResolver],
    dependencies: [single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./imported-symbol-identifier-resolver-CEuR5loD.js"), true ? __vite__mapDeps([8,1,2,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ImportedSymbolIdentifierResolver(...deps)
  });
  declareBean({
    name: "UseReader",
    provides: [toplevelReader],
    dependencies: [list(useProvider)],
    loadModule: () => __vitePreload(() => import("./use-reader-Ci9jogYq.js"), true ? __vite__mapDeps([9,1,2,4,5,10,11,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.UseReader(...deps)
  });
}
export {
  declareBeans
};
