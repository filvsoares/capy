const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./expression-statement-reader-qimf72h5.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./expression-statement-DaAWbzNd.js","./statement-BEQNu2Pd.js","./separator-D1CNARzn.js","./token-YbVOofIc.js","./statement-reader-impl-BpkVCr7Z.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, l as list } from "./index-BncJlCxS.js";
import { e as expressionReader } from "./expression-reader-BjAhtLB3.js";
import { a as statementItemReader, s as statementReader } from "./statement-reader-CEgcvo4S.js";
function declareBeans() {
  declareBean({
    name: "ExpressionStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./expression-statement-reader-qimf72h5.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionStatementReader(...deps)
  });
  declareBean({
    name: "StatementReaderImpl",
    provides: [statementReader],
    dependencies: [list(statementItemReader)],
    loadModule: () => __vitePreload(() => import("./statement-reader-impl-BpkVCr7Z.js"), true ? __vite__mapDeps([7,1,2,4]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StatementReaderImpl(...deps)
  });
}
export {
  declareBeans
};
