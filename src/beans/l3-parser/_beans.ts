import { declareBean } from '@/util/beans';
import { l3Parser } from './l3-parser';

export function declareBeans() {
  declareBean({
    name: 'L3ParserImpl',
    provides: [l3Parser],
    dependencies: [],
    loadModule: () => import('./l3-parser-impl'),
    factory: (m, deps) => new m.L3ParserImpl(...deps),
  });
}
