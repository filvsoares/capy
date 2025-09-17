const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tokenizer-impl-hgKGIwpX.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css","./token-BtqAZLUf.js","./bracket-reader-D3NZ2NV2.js","./bracket-DyCPjpk6.js","./number-reader-Dz4RhHvd.js","./number-B1q5ngO1.js","./operator-reader-cbNsw7ES.js","./operator-BvOOTirp.js","./separator-reader-CGH5PYis.js","./separator-DUrKHX5w.js","./string-reader-kfexs1ma.js","./string-DxqdHT9N.js","./whitespace-reader-bsPqHKTH.js","./word-reader-CHNkdatP.js","./identifier-D67RqHyN.js","./keyword-BPOLCCDh.js"])))=>i.map(i=>d[i]);
import { a as declareBeanInterface, d as declareBean, l as list, _ as __vitePreload, s as single } from "./index-3ZiCjh5_.js";
import { t as tokenizer } from "./tokenizer-1BH-GwZp.js";
const tokenReader = declareBeanInterface("TokenReader");
function declareBeans() {
  declareBean({
    name: "TokenizerImpl",
    provides: [tokenizer],
    dependencies: [list(tokenReader)],
    loadModule: () => __vitePreload(() => import("./tokenizer-impl-hgKGIwpX.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.TokenizerImpl(...deps)
  });
  declareBean({
    name: "BracketReader",
    provides: [tokenReader],
    dependencies: [single(tokenizer)],
    loadModule: () => __vitePreload(() => import("./bracket-reader-D3NZ2NV2.js"), true ? __vite__mapDeps([4,1,2,5,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.BracketReader(...deps)
  });
  declareBean({
    name: "NumberReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./number-reader-Dz4RhHvd.js"), true ? __vite__mapDeps([6,7,3,1,2]) : void 0, import.meta.url),
    factory: (m) => new m.NumberReader()
  });
  declareBean({
    name: "OperatorReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./operator-reader-cbNsw7ES.js"), true ? __vite__mapDeps([8,1,2,9,3]) : void 0, import.meta.url),
    factory: (m) => new m.OperatorReader()
  });
  declareBean({
    name: "SeparatorReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./separator-reader-CGH5PYis.js"), true ? __vite__mapDeps([10,1,2,11,3]) : void 0, import.meta.url),
    factory: (m) => new m.SeparatorReader()
  });
  declareBean({
    name: "StringReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./string-reader-kfexs1ma.js"), true ? __vite__mapDeps([12,1,2,13,3]) : void 0, import.meta.url),
    factory: (m) => new m.StringReader()
  });
  declareBean({
    name: "WhitespaceReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./whitespace-reader-bsPqHKTH.js"), true ? __vite__mapDeps([14,1,2]) : void 0, import.meta.url),
    factory: (m) => new m.WhitespaceReader()
  });
  declareBean({
    name: "WordReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./word-reader-CHNkdatP.js"), true ? __vite__mapDeps([15,16,3,1,2,17]) : void 0, import.meta.url),
    factory: (m) => new m.WordReader()
  });
}
export {
  declareBeans
};
