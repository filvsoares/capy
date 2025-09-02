import { parser } from '@/modules/parser/parser/parser';
import { parserCheck } from '@/modules/parser/parser/parser-check';
import { toplevelReader } from '@/modules/parser/parser/toplevel-reader';
import { tokenizer } from '@/modules/parser/tokenizer/tokenizer';
import { declareBean, list, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'ParserImpl',
    provides: [parser],
    dependencies: [single(tokenizer), list(toplevelReader), list(parserCheck)],
    loadModule: () => import('./parser-impl'),
    factory: (m, deps) => new m.ParserImpl(...deps),
  });
}
