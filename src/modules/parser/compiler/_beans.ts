import { parser } from '@/modules/parser/parser/parser';
import { declareBean, single } from '@/util/beans';
import { compiler } from './compiler';

export function declareBeans() {
  declareBean({
    name: 'CompilerImpl',
    provides: [compiler],
    dependencies: [single(parser)],
    loadModule: () => import('./compiler-impl'),
    factory: (m, deps) => new m.CompilerImpl(...deps),
  });
}
