import { declareBean } from '@/util/beans';
import { l2ToplevelReader } from './l2-toplevel-reader';
import { l2Parser } from './l2-parser';

export function declareBeans() {
  declareBean({
    name: 'L2ParserImpl',
    provides: [l2Parser],
    consumes: [l2ToplevelReader],
    loadModule: () => import('./l2-parser-impl'),
    factory: (m, deps) => new m.L2ParserImpl(deps),
  });
}
