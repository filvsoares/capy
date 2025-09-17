const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tokenizer-impl-DBA7p25l.js","./index-BPYk8cqz.js","./index-DW4arCFm.css","./token-C93Hpdaz.js","./bracket-reader-BvrlfACF.js","./bracket-CET9I_Ke.js","./number-reader-DUS9Aa_q.js","./number-BeETDviW.js","./operator-reader-BnC148_X.js","./operator-BNRdXr0O.js","./separator-reader-CMaObKtv.js","./separator-BWSZyVah.js","./string-reader-wN0BI4qR.js","./string-BMju32Tu.js","./whitespace-reader-CtCWmspw.js","./word-reader-CJ44P_jC.js","./identifier-ClyZKQs9.js","./keyword-D76bTD-h.js"])))=>i.map(i=>d[i]);
import { a as declareBeanInterface, d as declareBean, l as list, _ as __vitePreload, s as single } from "./index-BPYk8cqz.js";
import { t as tokenizer } from "./tokenizer-BepO_MWv.js";
const tokenReader = declareBeanInterface("TokenReader");
function declareBeans() {
  declareBean({
    name: "TokenizerImpl",
    provides: [tokenizer],
    dependencies: [list(tokenReader)],
    loadModule: () => __vitePreload(() => import("./tokenizer-impl-DBA7p25l.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.TokenizerImpl(...deps)
  });
  declareBean({
    name: "BracketReader",
    provides: [tokenReader],
    dependencies: [single(tokenizer)],
    loadModule: () => __vitePreload(() => import("./bracket-reader-BvrlfACF.js"), true ? __vite__mapDeps([4,1,2,5,3]) : void 0, import.meta.url),
    factory: (m, deps) => new m.BracketReader(...deps)
  });
  declareBean({
    name: "NumberReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./number-reader-DUS9Aa_q.js"), true ? __vite__mapDeps([6,7,3,1,2]) : void 0, import.meta.url),
    factory: (m) => new m.NumberReader()
  });
  declareBean({
    name: "OperatorReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./operator-reader-BnC148_X.js"), true ? __vite__mapDeps([8,1,2,9,3]) : void 0, import.meta.url),
    factory: (m) => new m.OperatorReader()
  });
  declareBean({
    name: "SeparatorReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./separator-reader-CMaObKtv.js"), true ? __vite__mapDeps([10,1,2,11,3]) : void 0, import.meta.url),
    factory: (m) => new m.SeparatorReader()
  });
  declareBean({
    name: "StringReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./string-reader-wN0BI4qR.js"), true ? __vite__mapDeps([12,1,2,13,3]) : void 0, import.meta.url),
    factory: (m) => new m.StringReader()
  });
  declareBean({
    name: "WhitespaceReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./whitespace-reader-CtCWmspw.js"), true ? __vite__mapDeps([14,1,2]) : void 0, import.meta.url),
    factory: (m) => new m.WhitespaceReader()
  });
  declareBean({
    name: "WordReader",
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => __vitePreload(() => import("./word-reader-CJ44P_jC.js"), true ? __vite__mapDeps([15,16,3,1,2,17]) : void 0, import.meta.url),
    factory: (m) => new m.WordReader()
  });
}
export {
  declareBeans
};
