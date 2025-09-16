import { expressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { expressionProcessor } from '@/modules/expression/expression-processor';
import { expressionReader } from '@/modules/expression/expression-reader';
import { operationProcessor } from '@/modules/expression/operation-processor';
import { typeReader } from '@/modules/type/type-reader';
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
  declareBean({
    name: 'CgAssignmentProcessor',
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => import('./cg-assignment-processor'),
    factory: (m, deps) => new m.CgAssignmentProcessor(...deps),
  });
  declareBean({
    name: 'StringConcatProcessor',
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => import('./string-concat-processor'),
    factory: (m, deps) => new m.StringConcatProcessor(...deps),
  });
}
