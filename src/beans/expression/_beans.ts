import { expressionReader } from '@/beans/expression/expression-reader';
import { operationProcessor } from '@/beans/expression/operation-processor';
import { referenceProcessor } from '@/beans/expression/reference-processor';
import { declareBean, list } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'ExpressionReaderImpl',
    provides: [expressionReader],
    dependencies: [list(referenceProcessor), list(operationProcessor)],
    loadModule: () => import('./expression-reader-impl'),
    factory: (m, deps) => new m.ExpressionReaderImpl(...deps),
  });
}
