const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tokenizer-impl-D5_XryD8.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css","./token-ofOFEBrc.js","./bracket-reader-BcaXqxay.js","./bracket-CzgbCMwV.js","./number-reader-Dk2YJRyY.js","./number-CZLMWsrr.js","./operator-reader-LAc40CH_.js","./operator-D6f5KmIA.js","./separator-reader-D5pHX-Io.js","./separator-DxWjJeA5.js","./string-reader-Dn3QcGFp.js","./string-sYMKUYfL.js","./whitespace-reader-DhEw2JMy.js","./word-reader-BfnEQHnr.js","./identifier-DiJZGL4m.js","./keyword-DRNOSLz1.js"])))=>i.map(i=>d[i]);
import { a as declareBeanInterface, d as declareBean, l as list, _ as __vitePreload, s as single } from "./index-DyTq3Mxn.js";
import { t as tokenizer } from "./tokenizer-BrFqumHj.js";
const tokenReader = declareBeanInterface("TokenReader");
function declareBeans() {
  declareBean({
    name: "TokenizerImpl",
    provides: [tokenizer],
    dependencies: [list(tokenReader)],
    loadModule: () => __vitePreload(() => import("./tokenizer-impl-D5_XryD8.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.TokenizerImpl(...deps)
  });
  declareBean({
    name: "BracketReader",
    provides: [tokenReader],
    dependencies: [single(tokenizer)],
    loadModule: () => __vitePreload(() => import("./bracket-reader-BcaXqxay.js"), true ? __vite__mapDeps([4,1,2,5,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.BracketReader(...deps)
  });
  declareBean({
    name: "NumberReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./number-reader-Dk2YJRyY.js"), true ? __vite__mapDeps([6,7,3,1,2]) : void 0, import.meta.url),
    factory: (m) => new m.NumberReader()
  });
  declareBean({
    name: "OperatorReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./operator-reader-LAc40CH_.js"), true ? __vite__mapDeps([8,1,2,9,3]) : void 0, import.meta.url),
    factory: (m) => new m.OperatorReader()
  });
  declareBean({
    name: "SeparatorReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./separator-reader-D5pHX-Io.js"), true ? __vite__mapDeps([10,1,2,11,3]) : void 0, import.meta.url),
    factory: (m) => new m.SeparatorReader()
  });
  declareBean({
    name: "StringReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./string-reader-Dn3QcGFp.js"), true ? __vite__mapDeps([12,1,2,13,3]) : void 0, import.meta.url),
    factory: (m) => new m.StringReader()
  });
  declareBean({
    name: "WhitespaceReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./whitespace-reader-DhEw2JMy.js"), true ? __vite__mapDeps([14,1,2]) : void 0, import.meta.url),
    factory: (m) => new m.WhitespaceReader()
  });
  declareBean({
    name: "WordReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./word-reader-BfnEQHnr.js"), true ? __vite__mapDeps([15,16,3,1,2,17]) : void 0, import.meta.url),
    factory: (m) => new m.WordReader()
  });
}
export {
  declareBeans
};
