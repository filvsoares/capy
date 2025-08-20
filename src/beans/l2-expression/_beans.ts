import { declareBean, list } from '@/util/beans';
import { l2ExpressionReader } from './l2-expression-reader';
import { l2OperationProcessor } from './l2-operation-processor';

export function declareBeans() {
  declareBean({
    name: 'L2ExpressionReaderImpl',
    provides: [l2ExpressionReader],
    dependencies: [list(l2OperationProcessor)],
    loadModule: () => import('./l2-expression-reader-impl'),
    factory: (m, deps) => new m.L2ExpressionReaderImpl(...deps),
  });
}
