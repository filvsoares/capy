import { declareBean, list } from '@/util/beans';
import { l2Parser } from './l2-parser';
import { l2ToplevelReader } from './l2-toplevel-reader';

export function declareBeans() {
  declareBean({
    name: 'L2ParserImpl',
    provides: [l2Parser],
    dependencies: [list(l2ToplevelReader)],
    loadModule: () => import('./l2-parser-impl'),
    factory: (m, deps) => new m.L2ParserImpl(...deps),
  });
}
