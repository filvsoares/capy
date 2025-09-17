const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./export-reader-BuXp-fyM.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css","./symbol-B09mnHSj.js","./keyword-DRNOSLz1.js","./token-ofOFEBrc.js","./export-data-CwGovO6H.js","./extra-Dqv87a62.js","./imported-symbol-identifier-resolver-lJPN1CId.js","./use-reader-DxIqKl2q.js","./separator-DxWjJeA5.js","./string-sYMKUYfL.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, p as parser, _ as __vitePreload, l as list } from "./index-DyTq3Mxn.js";
import { e as expressionReader } from "./expression-reader-D_oDuUvA.js";
import { i as identifierResolver } from "./identifier-resolver-CZD0pzuw.js";
import { p as parserHook } from "./parser-hook-DQR4w9rn.js";
import { t as toplevelReader } from "./toplevel-reader-BMha_raw.js";
import { u as useProvider } from "./use-provider-Mt4SMmyo.js";
function declareBeans() {
  declareBean({
    name: "ExportReader",
    provides: [toplevelReader, parserHook],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./export-reader-BuXp-fyM.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExportReader(...deps)
  });
  declareBean({
    name: "ImportedSymbolIdentifierResolver",
    provides: [identifierResolver],
    dependencies: [single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./imported-symbol-identifier-resolver-lJPN1CId.js"), true ? __vite__mapDeps([8,1,2,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ImportedSymbolIdentifierResolver(...deps)
  });
  declareBean({
    name: "UseReader",
    provides: [toplevelReader],
    dependencies: [list(useProvider)],
    loadModule: () => __vitePreload(() => import("./use-reader-DxIqKl2q.js"), true ? __vite__mapDeps([9,1,2,4,5,10,11,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.UseReader(...deps)
  });
}
export {
  declareBeans
};
