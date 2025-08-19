import { declareBean } from '@/util/beans';
import { l2ExpressionReader, l2OperationPass1Processor } from '../l2-expression/_bean-interfaces';

export function declareBeans() {
  declareBean({
    name: 'L2MethodCallProcessor',
    provides: [l2OperationPass1Processor],
    consumes: [l2ExpressionReader],
    loadModule: () => import('./l2-method-call-processor'),
    factory: (m, deps) => new m.L2MethodCallProcessor(deps),
  });
  declareBean({
    name: 'L2ArraySubscriptProcessor',
    provides: [l2OperationPass1Processor],
    consumes: [l2ExpressionReader],
    loadModule: () => import('./l2-array-subscript-processor'),
    factory: (m, deps) => new m.L2ArraySubscriptProcessor(deps),
  });
}
