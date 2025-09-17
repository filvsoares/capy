const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./expression-statement-reader-DdBvXASe.js","./index-BPYk8cqz.js","./index-DW4arCFm.css","./expression-statement-BS8iaRiv.js","./statement-eXuGN2Ox.js","./separator-BWSZyVah.js","./token-C93Hpdaz.js","./statement-reader-impl-CitWR7RR.js","./statement-processor-impl-CusL61Xc.js","./expression-statement-processor-DgImIeIJ.js"])))=>i.map(i=>d[i]);
import { d as declareBean, s as single, _ as __vitePreload, l as list } from "./index-BPYk8cqz.js";
import { e as expressionProcessor } from "./expression-processor-CSzvSGPX.js";
import { e as expressionReader } from "./expression-reader-Ns-x8iIn.js";
import { a as statementItemReader, s as statementReader, b as statementProcessor, c as statementItemProcessor } from "./statement-reader-rsljpUVH.js";
function declareBeans() {
  declareBean({
    name: "ExpressionStatementReader",
    provides: [statementItemReader],
    dependencies: [single(expressionReader)],
    loadModule: () => __vitePreload(() => import("./expression-statement-reader-DdBvXASe.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionStatementReader(...deps)
  });
  declareBean({
    name: "StatementReaderImpl",
    provides: [statementReader],
    dependencies: [list(statementItemReader)],
    loadModule: () => __vitePreload(() => import("./statement-reader-impl-CitWR7RR.js"), true ? __vite__mapDeps([7,1,2,4]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StatementReaderImpl(...deps)
  });
  declareBean({
    name: "StatementProcessorImpl",
    provides: [statementProcessor],
    dependencies: [list(statementItemProcessor)],
    loadModule: () => __vitePreload(() => import("./statement-processor-impl-CusL61Xc.js"), true ? __vite__mapDeps([8,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StatementProcessorImpl(...deps)
  });
  declareBean({
    name: "ExpressionStatementProcessor",
    provides: [statementItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-statement-processor-DgImIeIJ.js"), true ? __vite__mapDeps([9,3,4,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionStatementProcessor(...deps)
  });
}
export {
  declareBeans
};
