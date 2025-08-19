import { declareBean, list, single } from '@/util/beans';
import { l2ToplevelItemReader } from './l2-toplevel-item-reader';
import { l2StatementReader } from '../l2-statement/l2-statement-reader';
import { l2ToplevelReader } from '../l2-parser/l2-toplevel-reader';
import { l2TypeReader } from '../l2-type/l2-type-reader';
import { l2CallableTypeReader } from '../l2-type/l2-callable-type-reader';
import { l2ExpressionReader } from '../l2-expression/l2-expression-reader';

export function declareBeans() {
  declareBean({
    name: 'L2MethodReader',
    provides: [l2ToplevelItemReader],
    dependencies: [single(l2StatementReader), single(l2CallableTypeReader)],
    loadModule: () => import('./l2-method-reader'),
    factory: (m, deps) => new m.L2MethodReader(deps),
  });
  declareBean({
    name: 'L2UseReader',
    provides: [l2ToplevelItemReader],
    dependencies: [],
    loadModule: () => import('./l2-use-reader'),
    factory: (m) => new m.L2UseReader(),
  });
  declareBean({
    name: 'L2VariableReader',
    provides: [l2ToplevelItemReader],
    dependencies: [single(l2TypeReader), single(l2ExpressionReader)],
    loadModule: () => import('./l2-variable-reader'),
    factory: (m, deps) => new m.L2VariableReader(deps),
  });
  declareBean({
    name: 'L2ToplevelReaderImpl',
    provides: [l2ToplevelReader],
    dependencies: [list(l2ToplevelItemReader)],
    loadModule: () => import('./l2-toplevel-reader-impl'),
    factory: (m, deps) => new m.L2ToplevelReaderImpl(deps),
  });
}
