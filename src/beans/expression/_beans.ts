import { expressionReader } from '@/beans/expression/expression-reader';
import { identifierResolver } from '@/beans/expression/identifier-resolver';
import { operationProcessor } from '@/beans/expression/operation-processor';
import { declareBean, list } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'ExpressionReaderImpl',
    provides: [expressionReader],
    dependencies: [list(identifierResolver), list(operationProcessor)],
    loadModule: () => import('./expression-reader-impl'),
    factory: (m, deps) => new m.ExpressionReaderImpl(...deps),
  });
}
