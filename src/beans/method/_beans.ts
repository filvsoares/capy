import { declareBean, single } from '@/util/beans';
import { l3ReferenceProcessor } from '../expression/l3-reference-processor';
import { l2ToplevelReader } from '../l2-parser/l2-toplevel-reader';
import { l3ToplevelProcessor } from '../l3-parser/l3-toplevel-processor';
import { l2StatementReader } from '../statement/l2-statement-reader';
import { l3StatementProcessor } from '../statement/l3-statement-processor';
import { l2CallableTypeReader } from '../type/l2-callable-type-reader';
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
    name: 'L3MethodProcessor',
    provides: [l3ToplevelProcessor],
    dependencies: [single(l3TypeProcessor), single(l3StatementProcessor)],
    loadModule: () => import('./l3-method-processor'),
    factory: (m, deps) => new m.L3MethodProcessor(...deps),
  });
  declareBean({
    name: 'L3VariableReferenceProcessor',
    provides: [l3ReferenceProcessor],
    dependencies: [],
    loadModule: () => import('./l3-variable-reference-processor'),
    factory: (m) => new m.L3VariableReferenceProcessor(),
  });
}
