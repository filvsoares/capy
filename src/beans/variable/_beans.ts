import { declareBean, single } from '@/util/beans';
import { l2ExpressionReader } from '../expression/expression-reader';
import { l3ExpressionProcessor } from '../expression/l3-expression-processor';
import { l3ToplevelProcessor } from '../l3-parser/l3-toplevel-processor';
import { l2ToplevelReader } from '../parser/toplevel-reader';
import { l3TypeProcessor } from '../type/l3-type-processor';
import { typeReader } from '../type/type-reader';

export function declareBeans() {
  declareBean({
    name: 'L2VariableReader',
    provides: [l2ToplevelReader],
    dependencies: [single(typeReader), single(l2ExpressionReader)],
    loadModule: () => import('./l2-variable-reader'),
    factory: (m, deps) => new m.L2VariableReader(deps),
  });
  declareBean({
    name: 'L3VariableProcessor',
    provides: [l3ToplevelProcessor],
    dependencies: [single(l3TypeProcessor), single(l3ExpressionProcessor)],
    loadModule: () => import('./l3-variable-processor'),
    factory: (m, deps) => new m.L3VariableProcessor(...deps),
  });
}
