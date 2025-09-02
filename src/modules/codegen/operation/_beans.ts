import { expressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { expressionProcessor } from '@/modules/codegen/expression/expression-processor';
import { declareBean, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'AssignmentProcessor',
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => import('./assignment-processor'),
    factory: (m, deps) => new m.AssignmentProcessor(...deps),
  });
  declareBean({
    name: 'StringConcatProcessor',
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => import('./string-concat-processor'),
    factory: (m, deps) => new m.StringConcatProcessor(...deps),
  });
}
