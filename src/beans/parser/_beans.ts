import { parser } from '@/beans/parser/parser';
import { tokenReader } from '@/beans/parser/token-reader';
import { toplevelReader } from '@/beans/parser/toplevel-reader';
import { declareBean, list, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'ParserImpl',
    provides: [parser],
    dependencies: [list(tokenReader), list(toplevelReader)],
    loadModule: () => import('./parser-impl'),
    factory: (m, deps) => new m.ParserImpl(...deps),
  });
  declareBean({
    name: 'BracketReader',
    provides: [tokenReader],
    dependencies: [single(parser)],
    loadModule: () => import('./bracket-reader'),
    factory: (m, deps) => new m.BracketReader(...deps),
  });
  declareBean({
    name: 'NumberReader',
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => import('./number-reader'),
    factory: (m) => new m.NumberReader(),
  });
  declareBean({
    name: 'OperatorReader',
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => import('./operator-reader'),
    factory: (m) => new m.OperatorReader(),
  });
  declareBean({
    name: 'SeparatorReader',
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => import('./separator-reader'),
    factory: (m) => new m.SeparatorReader(),
  });
  declareBean({
    name: 'StringReader',
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => import('./string-reader'),
    factory: (m) => new m.StringReader(),
  });
  declareBean({
    name: 'WhitespaceReader',
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => import('./whitespace-reader'),
    factory: (m) => new m.WhitespaceReader(),
  });
  declareBean({
    name: 'WordReader',
    provides: [tokenReader],
    dependencies: [],
    loadModule: () => import('./word-reader'),
    factory: (m) => new m.WordReader(),
  });
}
