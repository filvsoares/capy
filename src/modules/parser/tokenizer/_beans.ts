import { tokenReader } from '@/modules/parser/tokenizer/token-reader';
import { tokenizer } from '@/modules/parser/tokenizer/tokenizer';
import { declareBean, list, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'TokenizerImpl',
    provides: [tokenizer],
    dependencies: [list(tokenReader)],
    loadModule: () => import('./tokenizer-impl'),
    factory: (m, deps) => new m.TokenizerImpl(...deps),
  });
  declareBean({
    name: 'BracketReader',
    provides: [tokenReader],
    dependencies: [single(tokenizer)],
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
