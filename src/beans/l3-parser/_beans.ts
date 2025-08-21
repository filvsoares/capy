import { declareBean, list } from '@/util/beans';
import { l3Parser } from './l3-parser';
import { l3ToplevelProcessor } from './l3-toplevel-processor';

export function declareBeans() {
  declareBean({
    name: 'L3ParserImpl',
    provides: [l3Parser],
    dependencies: [list(l3ToplevelProcessor)],
    loadModule: () => import('./l3-parser-impl'),
    factory: (m, deps) => new m.L3ParserImpl(...deps),
  });
}
