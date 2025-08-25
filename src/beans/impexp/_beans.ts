import { toplevelReader } from '@/beans/parser/toplevel-reader';
import { declareBean } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'L2UseReader',
    provides: [toplevelReader],
    dependencies: [],
    loadModule: () => import('./use-reader'),
    factory: (m) => new m.UseReader(),
  });
}
