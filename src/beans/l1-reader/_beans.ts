import { declareBean } from '@/util/beans';
import { l1Reader } from '../l1-parser/l1-reader';
import { l1Parser } from '../l1-parser/l1-parser';

export function declareBeans() {
  declareBean({
    name: 'L1BracketReader',
    provides: [l1Reader],
    consumes: [l1Parser],
    loadModule: () => import('./l1-bracket-reader'),
    factory: (m, deps) => new m.L1BracketReader(deps),
  });
  declareBean({
    name: 'L1NumberReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-number-reader'),
    factory: (m) => new m.L1NumberReader(),
  });
  declareBean({
    name: 'L1OperatorReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-operator-reader'),
    factory: (m) => new m.L1OperatorReader(),
  });
  declareBean({
    name: 'L1SeparatorReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-separator-reader'),
    factory: (m) => new m.L1SeparatorReader(),
  });
  declareBean({
    name: 'L1StringReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-string-reader'),
    factory: (m) => new m.L1StringReader(),
  });
  declareBean({
    name: 'L1WhitespaceReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-whitespace-reader'),
    factory: (m) => new m.L1WhitespaceReader(),
  });
  declareBean({
    name: 'L1WordReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-word-reader'),
    factory: (m) => new m.L1WordReader(),
  });
}
