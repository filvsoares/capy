import { expressionProcessor } from '@/modules/codegen/expression/expression-processor';
import { statementItemProcessor } from '@/modules/codegen/statement/statement-item-processor';
import { statementProcessor } from '@/modules/codegen/statement/statement-processor';
import { declareBean, list, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'StatementProcessorImpl',
    provides: [statementProcessor],
    dependencies: [list(statementItemProcessor)],
    loadModule: () => import('./statement-processor-impl'),
    factory: (m, deps) => new m.StatementProcessorImpl(...deps),
  });
  declareBean({
    name: 'ExpressionStatementProcessor',
    provides: [statementItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => import('./expression-statement-processor'),
    factory: (m, deps) => new m.ExpressionStatementProcessor(...deps),
  });
}
