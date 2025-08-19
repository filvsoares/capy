import { declareBean } from '@/util/beans';
import { l2ToplevelItemReader } from './_bean-interfaces';
import { l2StatementReader } from '../l2-statement/_bean-interfaces';
import { l2ToplevelReader } from '../l2-parser/_bean-interfaces';
import { l2CallableTypeReader, l2TypeReader } from '../l2-type/_bean-interfaces';
import { l2ExpressionReader } from '../l2-expression/_bean-interfaces';

export function declareBeans() {
  declareBean({
    name: 'L2MethodReader',
    provides: [l2ToplevelItemReader],
    consumes: [l2StatementReader, l2CallableTypeReader],
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
    consumes: [l2TypeReader, l2ExpressionReader],
    loadModule: () => import('./l2-variable-reader'),
    factory: (m, deps) => new m.L2VariableReader(deps),
  });
  declareBean({
    name: 'L2ToplevelReaderImpl',
    provides: [l2ToplevelReader],
    consumes: [l2ToplevelItemReader],
    loadModule: () => import('./l2-toplevel-reader'),
    factory: (m, deps) => new m.L2ToplevelReaderImpl(deps),
  });
}
