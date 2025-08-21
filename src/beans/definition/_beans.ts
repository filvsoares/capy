import { declareBean, single } from '@/util/beans';
import { l2ExpressionReader } from '../expression/l2-expression-reader';
import { l3ExpressionProcessor } from '../expression/l3-expression-processor';
import { l2ToplevelReader } from '../l2-parser/l2-toplevel-reader';
import { l3ToplevelProcessor } from '../l3-parser/l3-toplevel-processor';
import { l2StatementReader } from '../statement/l2-statement-reader';
import { l3StatementProcessor } from '../statement/l3-statement-processor';
import { l2CallableTypeReader } from '../type/l2-callable-type-reader';
import { l2TypeReader } from '../type/l2-type-reader';
import { l3TypeProcessor } from '../type/l3-type-processor';

export function declareBeans() {
  declareBean({
    name: 'L2MethodReader',
    provides: [l2ToplevelReader],
    dependencies: [single(l2StatementReader), single(l2CallableTypeReader)],
    loadModule: () => import('./l2-method-reader'),
    factory: (m, deps) => new m.L2MethodReader(deps),
  });
  declareBean({
    name: 'L2VariableReader',
    provides: [l2ToplevelReader],
    dependencies: [single(l2TypeReader), single(l2ExpressionReader)],
    loadModule: () => import('./l2-variable-reader'),
    factory: (m, deps) => new m.L2VariableReader(deps),
  });
  declareBean({
    name: 'L3MethodProcessor',
    provides: [l3ToplevelProcessor],
    dependencies: [single(l3TypeProcessor), single(l3StatementProcessor)],
    loadModule: () => import('./l3-method-processor'),
    factory: (m, deps) => new m.L3MethodProcessor(...deps),
  });
  declareBean({
    name: 'L3VariableProcessor',
    provides: [l3ToplevelProcessor],
    dependencies: [single(l3TypeProcessor), single(l3ExpressionProcessor)],
    loadModule: () => import('./l3-variable-processor'),
    factory: (m, deps) => new m.L3VariableProcessor(...deps),
  });
}
