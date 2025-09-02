import { expressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { expressionProcessor } from '@/modules/codegen/expression/expression-processor';
import { declareBean, list, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'DereferenceProcessor',
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => import('./dereference-processor'),
    factory: (m, deps) => new m.DereferenceProcessor(...deps),
  });
  declareBean({
    name: 'ExpressionProcessorImpl',
    provides: [expressionProcessor],
    dependencies: [list(expressionItemProcessor)],
    loadModule: () => import('./expression-processor-impl'),
    factory: (m, deps) => new m.ExpressionProcessorImpl(...deps),
  });
  declareBean({
    name: 'StringLiteralProcessor',
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => import('./string-literal-processor'),
    factory: (m, deps) => new m.StringLiteralProcessor(...deps),
  });
}
