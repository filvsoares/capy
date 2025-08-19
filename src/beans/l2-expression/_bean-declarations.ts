import { declareBean } from '@/util/beans';
import { l2ExpressionReader, l2OperationPass1Processor } from './_bean-interfaces';

export function declareBeans() {
  declareBean({
    name: 'L2ExpressionReaderImpl',
    provides: [l2ExpressionReader],
    consumes: [l2OperationPass1Processor],
    loadModule: () => import('./l2-expression-reader'),
    factory: (m, deps) => new m.L2ExpressionReaderImpl(deps),
  });
}
