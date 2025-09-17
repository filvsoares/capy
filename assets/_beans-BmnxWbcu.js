const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./export-reader-BFUvOP4o.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css","./symbol-CzSKJU1d.js","./keyword-BPOLCCDh.js","./token-BtqAZLUf.js","./export-data-CwGovO6H.js","./extra-Dqv87a62.js","./imported-symbol-identifier-resolver-CCAuxfvQ.js","./use-reader-Dv04UIzG.js","./separator-DUrKHX5w.js","./string-DxqdHT9N.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, p as parser, _ as __vitePreload, l as list } from "./index-3ZiCjh5_.js";
import { e as expressionReader } from "./expression-reader-CID0cSEz.js";
import { i as identifierResolver } from "./identifier-resolver-drQlUuY0.js";
import { p as parserHook } from "./parser-hook-BhQsYzCC.js";
import { t as toplevelReader } from "./toplevel-reader-DaGaKSjK.js";
import { u as useProvider } from "./use-provider-B63FQBKY.js";
function declareBeans() {
  declareBean({
    name: "ExportReader",
    provides: [toplevelReader, parserHook],
    dependencies: [single(parser)],
    loadModule: () => __vitePreload(() => import("./export-reader-BFUvOP4o.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExportReader(...deps)
  });
  declareBean({
    name: "ImportedSymbolIdentifierResolver",
    provides: [identifierResolver],
    dependencies: [single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./imported-symbol-identifier-resolver-CCAuxfvQ.js"), true ? __vite__mapDeps([8,1,2,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ImportedSymbolIdentifierResolver(...deps)
  });
  declareBean({
    name: "UseReader",
    provides: [toplevelReader],
    dependencies: [list(useProvider)],
    loadModule: () => __vitePreload(() => import("./use-reader-Dv04UIzG.js"), true ? __vite__mapDeps([9,1,2,4,5,10,11,6,7]) : void 0, import.meta.url),
    factory: (m, deps) => new m.UseReader(...deps)
  });
}
export {
  declareBeans
};
