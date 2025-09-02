const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tokenizer-impl-GiaRTCmo.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./token-YbVOofIc.js","./bracket-reader-cww89wnU.js","./bracket-BTNv1ZF5.js","./number-reader-Dbqa6Wi8.js","./number-CdDxkblR.js","./operator-reader-Da8AXqcS.js","./operator-CJR6HJ2X.js","./separator-reader-B7g74Z3J.js","./separator-D1CNARzn.js","./string-reader-DafAR-12.js","./string-BimwP1qe.js","./whitespace-reader-wo6syhmg.js","./word-reader-dlsiqFVy.js","./identifier-CQkte7dE.js","./keyword-DP2VjTYJ.js"])))=>i.map(i=>d[i]);
import { a as declareBeanInterface, d as declareBean, l as list, _ as __vitePreload, s as single } from "./index-BncJlCxS.js";
import { t as tokenizer } from "./tokenizer-BDWh0F-K.js";
const tokenReader = declareBeanInterface("TokenReader");
function declareBeans() {
  declareBean({
    name: "TokenizerImpl",
    provides: [tokenizer],
    dependencies: [list(tokenReader)],
    loadModule: () => __vitePreload(() => import("./tokenizer-impl-GiaRTCmo.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.TokenizerImpl(...deps)
  });
  declareBean({
    name: "BracketReader",
    provides: [tokenReader],
    dependencies: [single(tokenizer)],
    loadModule: () => __vitePreload(() => import("./bracket-reader-cww89wnU.js"), true ? __vite__mapDeps([4,1,2,5,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.BracketReader(...deps)
  });
  declareBean({
    name: "NumberReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./number-reader-Dbqa6Wi8.js"), true ? __vite__mapDeps([6,7,3,1,2]) : void 0, import.meta.url),
    factory: (m) => new m.NumberReader()
  });
  declareBean({
    name: "OperatorReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./operator-reader-Da8AXqcS.js"), true ? __vite__mapDeps([8,1,2,9,3]) : void 0, import.meta.url),
    factory: (m) => new m.OperatorReader()
  });
  declareBean({
    name: "SeparatorReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./separator-reader-B7g74Z3J.js"), true ? __vite__mapDeps([10,1,2,11,3]) : void 0, import.meta.url),
    factory: (m) => new m.SeparatorReader()
  });
  declareBean({
    name: "StringReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./string-reader-DafAR-12.js"), true ? __vite__mapDeps([12,1,2,13,3]) : void 0, import.meta.url),
    factory: (m) => new m.StringReader()
  });
  declareBean({
    name: "WhitespaceReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./whitespace-reader-wo6syhmg.js"), true ? __vite__mapDeps([14,1,2]) : void 0, import.meta.url),
    factory: (m) => new m.WhitespaceReader()
  });
  declareBean({
    name: "WordReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./word-reader-dlsiqFVy.js"), true ? __vite__mapDeps([15,16,3,1,2,17]) : void 0, import.meta.url),
    factory: (m) => new m.WordReader()
  });
}
export {
  declareBeans
};
