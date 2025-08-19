import { declareBean, single } from '@/util/beans';
import { l2OperationProcessor } from '../l2-expression/l2-operation-processor';
import { l2ExpressionReader } from '../l2-expression/l2-expression-reader';

export function declareBeans() {
  declareBean({
    name: 'L2MethodCallProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-method-call-processor'),
    factory: (m, deps) => new m.L2MethodCallProcessor(deps),
  });
  declareBean({
    name: 'L2ArraySubscriptProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-array-subscript-processor'),
    factory: (m, deps) => new m.L2ArraySubscriptProcessor(deps),
  });
  declareBean({
    name: 'L2MemberAccessProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-member-access-processor'),
    factory: (m, deps) => new m.L2MemberAccessProcessor(deps),
  });
  declareBean({
    name: 'L2UnaryMinusProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-unary-minus-processor'),
    factory: (m, deps) => new m.L2UnaryMinusProcessor(deps),
  });
  declareBean({
    name: 'L2UnaryPlusProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-unary-plus-processor'),
    factory: (m, deps) => new m.L2UnaryPlusProcessor(deps),
  });
}
