import { declareBean, list, single } from '@/util/beans';
import { l3TypeProcessor } from '../type/l3-type-processor';
import { l2ExpressionReader } from './l2-expression-reader';
import { l2OperationProcessor } from './l2-operation-processor';
import { l3ExpressionProcessor } from './l3-expression-processor';
import { l3OperationProcessor } from './l3-operation-processor';
import { l3ReferenceProcessor } from './l3-reference-processor';

export function declareBeans() {
  declareBean({
    name: 'L2ExpressionReaderImpl',
    provides: [l2ExpressionReader],
    dependencies: [list(l2OperationProcessor)],
    loadModule: () => import('./l2-expression-reader-impl'),
    factory: (m, deps) => new m.L2ExpressionReaderImpl(...deps),
  });
  declareBean({
    name: 'L3ExpressionProcessorImpl',
    provides: [l3ExpressionProcessor],
    dependencies: [list(l3OperationProcessor), list(l3ReferenceProcessor), single(l3TypeProcessor)],
    loadModule: () => import('../expression/l3-expression-processor-impl'),
    factory: (m, deps) => new m.L3ExpressionProcessorImpl(...deps),
  });
}
