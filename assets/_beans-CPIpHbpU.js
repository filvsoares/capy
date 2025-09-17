const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./expression-statement-reader-BHPYwtx3.js","./index-3ZiCjh5_.js","./index-DW4arCFm.css","./expression-statement-DV-fZMAI.js","./statement-D1Z7utbn.js","./separator-DUrKHX5w.js","./token-BtqAZLUf.js","./statement-reader-impl-B9JD4gg_.js","./statement-processor-impl-KSgTZ3BM.js","./expression-statement-processor-CczWOs49.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, l as list } from "./index-3ZiCjh5_.js";
import { e as expressionProcessor } from "./expression-processor-_k5xIL4f.js";
import { e as expressionReader } from "./expression-reader-CID0cSEz.js";
import { a as statementItemReader, s as statementReader, b as statementProcessor, c as statementItemProcessor } from "./statement-reader-B3-P9cu7.js";
function declareBeans() {
  declareBean({
    name: "ExpressionStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./expression-statement-reader-BHPYwtx3.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionStatementReader(...deps)
  });
  declareBean({
    name: "StatementReaderImpl",
    provides: [statementReader],
    dependencies: [list(statementItemReader)],
    loadModule: () => __vitePreload(() => import("./statement-reader-impl-B9JD4gg_.js"), true ? __vite__mapDeps([7,1,2,4]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StatementReaderImpl(...deps)
  });
  declareBean({
    name: "StatementProcessorImpl",
    provides: [statementProcessor],
    dependencies: [list(statementItemProcessor)],
    loadModule: () => __vitePreload(() => import("./statement-processor-impl-KSgTZ3BM.js"), true ? __vite__mapDeps([8,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StatementProcessorImpl(...deps)
  });
  declareBean({
    name: "ExpressionStatementProcessor",
    provides: [statementItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-statement-processor-CczWOs49.js"), true ? __vite__mapDeps([9,3,4,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionStatementProcessor(...deps)
  });
}
export {
  declareBeans
};
