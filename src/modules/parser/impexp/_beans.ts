import { parser } from '@/modules/parser/parser/parser';
import { toplevelReader } from '@/modules/parser/parser/toplevel-reader';
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
