import { declareBean } from '@/util/beans';
import { l2Parser, l2ToplevelReader } from './_bean-interfaces';

export function declareBeans() {
  declareBean({
    name: 'L2ParserImpl',
    provides: [l2Parser],
    consumes: [l2ToplevelReader],
    loadModule: () => import('./l2-parser'),
    factory: (m, deps) => new m.L2ParserImpl(deps),
  });
}
