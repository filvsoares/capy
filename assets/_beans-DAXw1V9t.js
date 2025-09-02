const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./statement-processor-impl-BRisl8aw.js","./index-BncJlCxS.js","./index-CPiuw3hb.css","./expression-statement-processor-CUE5pLWJ.js","./expression-statement-DaAWbzNd.js","./statement-BEQNu2Pd.js"])))=>i.map(i=>d[i]);
import { d as declareBean, l as list, _ as __vitePreload, s as single } from "./index-BncJlCxS.js";
import { e as expressionProcessor } from "./expression-processor-cB5RnEiF.js";
import { s as statementProcessor, a as statementItemProcessor } from "./statement-processor-BcNMfN4f.js";
function declareBeans() {
  declareBean({
    name: "StatementProcessorImpl",
    provides: [statementProcessor],
    dependencies: [list(statementItemProcessor)],
    loadModule: () => __vitePreload(() => import("./statement-processor-impl-BRisl8aw.js"), true ? __vite__mapDeps([0,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.StatementProcessorImpl(...deps)
  });
  declareBean({
    name: "ExpressionStatementProcessor",
    provides: [statementItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => __vitePreload(() => import("./expression-statement-processor-CUE5pLWJ.js"), true ? __vite__mapDeps([3,4,5,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.ExpressionStatementProcessor(...deps)
  });
}
export {
  declareBeans
};
