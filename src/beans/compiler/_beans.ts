import { tokenizer } from '@/beans/tokenizer/tokenizer';
import { declareBean, single } from '@/util/beans';
import { parser } from '../parser/parser';
import { compiler } from './compiler';

export function declareBeans() {
  declareBean({
    name: 'CompilerImpl',
    provides: [compiler],
    dependencies: [single(tokenizer), single(parser)],
    loadModule: () => import('./compiler-impl'),
    factory: (m, deps) => new m.CompilerImpl(...deps),
  });
}
