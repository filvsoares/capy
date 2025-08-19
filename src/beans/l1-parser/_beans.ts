import { declareBean, list } from '@/util/beans';
import { l1Reader } from './l1-reader';
import { l1Parser } from './l1-parser';

export function declareBeans() {
  declareBean({
    name: 'L1ParserImpl',
    provides: [l1Parser],
    dependencies: [list(l1Reader)],
    loadModule: () => import('./l1-parser-impl'),
    factory: (m, deps) => new m.L1ParserImpl(deps),
  });
}
