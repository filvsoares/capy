import { declareBean } from '@/util/beans';
import { l1Reader } from './_bean-interfaces';
import { l1Parser } from '../_bean-interfaces';

export function declareBeans() {
  declareBean({
    name: 'L1BracketReader',
    provides: [l1Reader],
    consumes: [l1Parser],
    loadModule: () => import('./l1-bracket'),
    factory: (m, deps) => new m.L1BracketReader(deps),
  });
  declareBean({
    name: 'L1NumberReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-number'),
    factory: (m) => new m.L1NumberReader(),
  });
  declareBean({
    name: 'L1OperatorReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-operator'),
    factory: (m) => new m.L1OperatorReader(),
  });
  declareBean({
    name: 'L1SeparatorReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-separator'),
    factory: (m) => new m.L1SeparatorReader(),
  });
  declareBean({
    name: 'L1StringReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-string'),
    factory: (m) => new m.L1StringReader(),
  });
  declareBean({
    name: 'L1WhitespaceReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-whitespace'),
    factory: (m) => new m.L1WhitespaceReader(),
  });
  declareBean({
    name: 'L1WordReader',
    provides: [l1Reader],
    consumes: [],
    loadModule: () => import('./l1-word'),
    factory: (m) => new m.L1WordReader(),
  });
}
