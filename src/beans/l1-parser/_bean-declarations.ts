import { declareBean } from '@/util/beans';
import { l1Parser } from './_bean-interfaces';
import { l1Reader } from './_bean-interfaces';

export function declareBeans() {
  declareBean({
    name: 'L1ParserImpl',
    provides: [l1Parser],
    consumes: [l1Reader],
    loadModule: () => import('./l1-parser'),
    factory: (m, deps) => new m.L1ParserImpl(deps),
  });
}
