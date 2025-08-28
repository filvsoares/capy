import { expressionReader } from '@/modules/parser/expression/expression-reader';
import { statementItemReader } from '@/modules/parser/statement/statement-item-reader';
import { statementReader } from '@/modules/parser/statement/statement-reader';
import { typeReader } from '@/modules/parser/type/type-reader';
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
    name: 'ReturnStatementReader',
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => import('./return-statement-reader'),
    factory: (m, deps) => new m.ReturnStatementReader(...deps),
  });
  declareBean({
    name: 'StatementReaderImpl',
    provides: [statementReader],
    dependencies: [list(statementItemReader)],
    loadModule: () => import('./statement-reader-impl'),
    factory: (m, deps) => new m.StatementReaderImpl(...deps),
  });
}
