const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./runner-impl-Bk45z9hr.js","./index-BPYk8cqz.js","./index-DW4arCFm.css"])))=>i.map(i=>d[i]);
import { d as declareBean, r as runner, l as list, _ as __vitePreload } from "./index-BPYk8cqz.js";
import { r as runnerArgsProvider } from "./runner-args-provider-CMwXSIvb.js";
function declareBeans() {
  declareBean({
    name: "RunnerImpl",
    provides: [runner],
    dependencies: [list(runnerArgsProvider)],
    loadModule: () => __vitePreload(() => import("./runner-impl-Bk45z9hr.js"), true ? __vite__mapDeps([0,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.RunnerImpl(...deps)
  });
}
export {
  declareBeans
};
