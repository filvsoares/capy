import { declareBean } from '@/util/beans';
import { l2StatementItemReader, l2StatementReader } from './_bean-interfaces';
import { l2ExpressionReader } from '../l2-expression/_bean-interfaces';

export function declareBeans() {
  declareBean({
    name: 'L2ExpressionStatementReader',
    provides: [l2StatementItemReader],
    consumes: [l2ExpressionReader],
    loadModule: () => import('./l2-expression-statement-reader'),
    factory: (m, deps) => new m.L2ExpressionStatementReader(deps),
  });
  declareBean({
    name: 'L2ReturnStatementReader',
    provides: [l2StatementItemReader],
    consumes: [l2ExpressionReader],
    loadModule: () => import('./l2-return-statement-reader'),
    factory: (m, deps) => new m.L2ReturnStatementReader(deps),
  });
  declareBean({
    name: 'L2StatementReaderImpl',
    provides: [l2StatementReader],
    consumes: [l2StatementItemReader],
    loadModule: () => import('./l2-statement-reader'),
    factory: (m, deps) => new m.L2StatementReaderImpl(deps),
  });
}
