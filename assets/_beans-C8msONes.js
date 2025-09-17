const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./expression-statement-reader-CdKulqAJ.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css","./expression-statement-s9BqjCE-.js","./statement-1pRbB8Zx.js","./separator-DxWjJeA5.js","./token-ofOFEBrc.js","./statement-reader-impl-MjeNDK7O.js","./statement-processor-impl-B0cS-Vfv.js","./expression-statement-processor-Gz4oYzfG.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, l as list } from "./index-DyTq3Mxn.js";
import { e as expressionProcessor } from "./expression-processor-DQ-gQ6lR.js";
import { e as expressionReader } from "./expression-reader-D_oDuUvA.js";
import { a as statementItemReader, s as statementReader, b as statementProcessor, c as statementItemProcessor } from "./statement-reader-DEl4Ch8T.js";
function declareBeans() {
  declareBean({
    name: "ExpressionStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./expression-statement-reader-CdKulqAJ.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionStatementReader(...deps)
  });
  declareBean({
    name: "StatementReaderImpl",
    provides: [statementReader],
    dependencies: [list(statementItemReader)],
    loadModule: () => __vitePreload(() => import("./statement-reader-impl-MjeNDK7O.js"), true ? __vite__mapDeps([7,1,2,4]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StatementReaderImpl(...deps)
  });
  declareBean({
    name: "StatementProcessorImpl",
    provides: [statementProcessor],
    dependencies: [list(statementItemProcessor)],
    loadModule: () => __vitePreload(() => import("./statement-processor-impl-B0cS-Vfv.js"), true ? __vite__mapDeps([8,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StatementProcessorImpl(...deps)
  });
  declareBean({
    name: "ExpressionStatementProcessor",
    provides: [statementItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-statement-processor-Gz4oYzfG.js"), true ? __vite__mapDeps([9,3,4,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionStatementProcessor(...deps)
  });
}
export {
  declareBeans
};
