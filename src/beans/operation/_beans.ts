import { declareBean, single } from '@/util/beans';
import { l2ExpressionReader } from '../expression/l2-expression-reader';
import { l2OperationProcessor } from '../expression/l2-operation-processor';
import { l3ExpressionProcessor } from '../expression/l3-expression-processor';
import { l3OperationProcessor } from '../expression/l3-operation-processor';
import { l3TypeProcessor } from '../type/l3-type-processor';

export function declareBeans() {
  declareBean({
    name: 'L2MethodCallProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-method-call-processor'),
    factory: (m, deps) => new m.L2MethodCallProcessor(...deps),
  });
  declareBean({
    name: 'L2ArraySubscriptProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-array-subscript-processor'),
    factory: (m, deps) => new m.L2ArraySubscriptProcessor(...deps),
  });
  declareBean({
    name: 'L2MemberAccessProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-member-access-processor'),
    factory: (m, deps) => new m.L2MemberAccessProcessor(...deps),
  });
  declareBean({
    name: 'L2UnaryMinusProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-unary-minus-processor'),
    factory: (m, deps) => new m.L2UnaryMinusProcessor(...deps),
  });
  declareBean({
    name: 'L2UnaryPlusProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-unary-plus-processor'),
    factory: (m, deps) => new m.L2UnaryPlusProcessor(...deps),
  });
  declareBean({
    name: 'L2AdditionProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-addition-processor'),
    factory: (m, deps) => new m.L2AdditionProcessor(...deps),
  });
  declareBean({
    name: 'L2SubtractionProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-subtraction-processor'),
    factory: (m, deps) => new m.L2SubtractionProcessor(...deps),
  });
  declareBean({
    name: 'L2MultiplicationProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-multiplication-processor'),
    factory: (m, deps) => new m.L2MultiplicationProcessor(...deps),
  });
  declareBean({
    name: 'L2DivisionProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-division-processor'),
    factory: (m, deps) => new m.L2DivisionProcessor(...deps),
  });
  declareBean({
    name: 'L2RemainderProcessor',
    provides: [l2OperationProcessor],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-remainder-processor'),
    factory: (m, deps) => new m.L2RemainderProcessor(...deps),
  });
  declareBean({
    name: 'L3OperationProcessorImpl',
    provides: [l3OperationProcessor],
    dependencies: [single(l3ExpressionProcessor), single(l3TypeProcessor)],
    loadModule: () => import('./l3-operation-processor-impl'),
    factory: (m, deps) => new m.L3OperationProcessorImpl(...deps),
  });
}
