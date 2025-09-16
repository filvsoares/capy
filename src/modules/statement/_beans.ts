import { expressionProcessor } from '@/modules/expression/expression-processor';
import { expressionReader } from '@/modules/expression/expression-reader';
import { statementItemProcessor } from '@/modules/statement/statement-item-processor';
import { statementItemReader } from '@/modules/statement/statement-item-reader';
import { statementProcessor } from '@/modules/statement/statement-processor';
import { statementReader } from '@/modules/statement/statement-reader';
import { declareBean, list, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'ExpressionStatementReader',
    provides: [statementItemReader],
    dependencies: [single(expressionReader)],
    loadModule: () => import('./expression-statement-reader'),
    factory: (m, deps) => new m.ExpressionStatementReader(...deps),
  });
  declareBean({
    name: 'StatementReaderImpl',
    provides: [statementReader],
    dependencies: [list(statementItemReader)],
    loadModule: () => import('./statement-reader-impl'),
    factory: (m, deps) => new m.StatementReaderImpl(...deps),
  });
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
