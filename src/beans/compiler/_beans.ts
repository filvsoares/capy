import { declareBean, single } from '@/util/beans';
import { l1Parser } from '../l1-parser/l1-parser';
import { l2Parser } from '../l2-parser/l2-parser';
import { l3Parser } from '../l3-parser/l3-parser';
import { compiler } from './compiler';

export function declareBeans() {
  declareBean({
    name: 'L3ParserImpl',
    provides: [compiler],
    dependencies: [single(l1Parser), single(l2Parser), single(l3Parser)],
    loadModule: () => import('./compiler-impl'),
    factory: (m, deps) => new m.CompilerImpl(...deps),
  });
}
