import { expressionReader } from '@/beans/expression/expression-reader';
import { operationProcessor } from '@/beans/expression/operation-processor';
import { typeReader } from '@/beans/type/type-reader';
import { declareBean, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'AdditionProcessor',
    provides: [operationProcessor],
    dependencies: [single(expressionReader)],
    loadModule: () => import('./addition-processor'),
    factory: (m, deps) => new m.AdditionProcessor(...deps),
  });
  declareBean({
    name: 'AssignmentProcessor',
    provides: [operationProcessor],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => import('./assignment-processor'),
    factory: (m, deps) => new m.AssignmentProcessor(...deps),
  });
}
