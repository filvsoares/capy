import { declareBean, list, single } from '@/util/beans';
import { l1Parser } from './l1-parser';
import { l1Reader } from './l1-reader';

export function declareBeans() {
  declareBean({
    name: 'L1ParserImpl',
    provides: [l1Parser],
    dependencies: [list(l1Reader)],
    loadModule: () => import('./l1-parser-impl'),
    factory: (m, deps) => new m.L1ParserImpl(deps),
  });
  declareBean({
    name: 'L1BracketReader',
    provides: [l1Reader],
    dependencies: [single(l1Parser)],
    loadModule: () => import('./l1-bracket-reader'),
    factory: (m, deps) => new m.L1BracketReader(deps),
  });
  declareBean({
    name: 'L1NumberReader',
    provides: [l1Reader],
    dependencies: [],
    loadModule: () => import('./l1-number-reader'),
    factory: (m) => new m.L1NumberReader(),
  });
  declareBean({
    name: 'L1OperatorReader',
    provides: [l1Reader],
    dependencies: [],
    loadModule: () => import('./l1-operator-reader'),
    factory: (m) => new m.L1OperatorReader(),
  });
  declareBean({
    name: 'L1SeparatorReader',
    provides: [l1Reader],
    dependencies: [],
    loadModule: () => import('./l1-separator-reader'),
    factory: (m) => new m.L1SeparatorReader(),
  });
  declareBean({
    name: 'L1StringReader',
    provides: [l1Reader],
    dependencies: [],
    loadModule: () => import('./l1-string-reader'),
    factory: (m) => new m.L1StringReader(),
  });
  declareBean({
    name: 'L1WhitespaceReader',
    provides: [l1Reader],
    dependencies: [],
    loadModule: () => import('./l1-whitespace-reader'),
    factory: (m) => new m.L1WhitespaceReader(),
  });
  declareBean({
    name: 'L1WordReader',
    provides: [l1Reader],
    dependencies: [],
    loadModule: () => import('./l1-word-reader'),
    factory: (m) => new m.L1WordReader(),
  });
}
