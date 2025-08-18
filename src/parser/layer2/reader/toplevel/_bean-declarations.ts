import { declareBean } from '@/util/beans';
import { l2ToplevelItemReader, l2ToplevelReader } from './_bean-interfaces';
import { l2StatementReader } from '../statement/_bean-interfaces';

export function declareBeans() {
  declareBean({
    name: 'L2MethodReader',
    provides: [l2ToplevelItemReader],
    consumes: [l2StatementReader],
    loadModule: () => import('./l2-method-reader'),
    factory: (m, deps) => new m.L2MethodReader(deps),
  });
  declareBean({
    name: 'L2UseReader',
    provides: [l2ToplevelItemReader],
    consumes: [],
    loadModule: () => import('./l2-use-reader'),
    factory: (m) => new m.L2UseReader(),
  });
  declareBean({
    name: 'L2VariableReader',
    provides: [l2ToplevelItemReader],
    consumes: [],
    loadModule: () => import('./l2-variable-reader'),
    factory: (m) => new m.L2VariableReader(),
  });
  declareBean({
    name: 'L2ToplevelReaderImpl',
    provides: [l2ToplevelReader],
    consumes: [l2ToplevelItemReader],
    loadModule: () => import('./l2-toplevel-reader'),
    factory: (m, deps) => new m.L2ToplevelReaderImpl(deps),
  });
}
