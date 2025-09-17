const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./runner-impl-zJr3UouQ.js","./index-DyTq3Mxn.js","./index-DKs51LSz.css"])))=>i.map(i=>d[i]);
import { d as declareBean, r as runner, l as list, _ as __vitePreload } from "./index-DyTq3Mxn.js";
import { r as runnerArgsProvider } from "./runner-args-provider-DNwi-xSl.js";
function declareBeans() {
  declareBean({
    name: "RunnerImpl",
    provides: [runner],
    dependencies: [list(runnerArgsProvider)],
    loadModule: () => __vitePreload(() => import("./runner-impl-zJr3UouQ.js"), true ? __vite__mapDeps([0,1,2]) : void 0, import.meta.url),
    factory: (m, deps) => new m.RunnerImpl(...deps)
  });
}
export {
  declareBeans
};
