import { parser } from '@/beans/parser/parser';
import { toplevelReader } from '@/beans/parser/toplevel-reader';
import { declareBean, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'UseReader',
    provides: [toplevelReader],
    dependencies: [single(parser)],
    loadModule: () => import('./use-reader'),
    factory: (m, deps) => new m.UseReader(...deps),
  });
}
