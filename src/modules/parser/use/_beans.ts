import { toplevelReader } from '@/modules/parser/parser/toplevel-reader';
import { declareBean } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'UseReader',
    provides: [toplevelReader],
    dependencies: [],
    loadModule: () => import('./use-reader'),
    factory: (m, deps) => new m.UseReader(...deps),
  });
}
