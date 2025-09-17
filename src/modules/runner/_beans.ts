import { runner } from '@/modules/runner/runner';
import { runnerArgsProvider } from '@/modules/runner/runner-args-provider';
import { declareBean, list } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'RunnerImpl',
    provides: [runner],
    dependencies: [list(runnerArgsProvider)],
    loadModule: () => import('./runner-impl'),
    factory: (m, deps) => new m.RunnerImpl(...deps),
  });
}
