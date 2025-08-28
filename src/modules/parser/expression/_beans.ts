import { expressionReader } from '@/modules/parser/expression/expression-reader';
import { identifierResolver } from '@/modules/parser/expression/identifier-resolver';
import { operationProcessor } from '@/modules/parser/expression/operation-processor';
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
