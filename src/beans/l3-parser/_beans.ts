import { l3Parser } from '@/beans/l3-parser/l3-parser';
import { l3ToplevelProcessor } from '@/beans/l3-parser/l3-toplevel-processor';
import { declareBean, list } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'L3ParserImpl',
    provides: [l3Parser],
    dependencies: [list(l3ToplevelProcessor)],
    loadModule: () => import('./l3-parser-impl'),
    factory: (m, deps) => new m.L3ParserImpl(...deps),
  });
}
