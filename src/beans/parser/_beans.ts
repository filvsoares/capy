import { parser } from '@/beans/parser/parser';
import { toplevelReader } from '@/beans/parser/toplevel-reader';
import { tokenizer } from '@/beans/tokenizer/tokenizer';
import { declareBean, list, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'ParserImpl',
    provides: [parser],
    dependencies: [single(tokenizer), list(toplevelReader)],
    loadModule: () => import('./parser-impl'),
    factory: (m, deps) => new m.ParserImpl(...deps),
  });
}
