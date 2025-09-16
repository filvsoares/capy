import { expressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { expressionProcessor } from '@/modules/expression/expression-processor';
import { expressionReader } from '@/modules/expression/expression-reader';
import { identifierResolver } from '@/modules/expression/identifier-resolver';
import { operationProcessor } from '@/modules/expression/operation-processor';
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
  declareBean({
    name: 'ExpressionReaderImpl',
    provides: [expressionReader],
    dependencies: [list(identifierResolver), list(operationProcessor)],
    loadModule: () => import('./expression-reader-impl'),
    factory: (m, deps) => new m.ExpressionReaderImpl(...deps),
  });
}
