import { declareBean } from '@/util/beans';
import { l2StatementReader } from './l2-statement-reader';
import { l2StatementItemReader } from './l2-statement-item-reader';
import { l2ExpressionReader } from '../l2-expression/l2-expression-reader';

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
    loadModule: () => import('./l2-statement-reader-impl'),
    factory: (m, deps) => new m.L2StatementReaderImpl(deps),
  });
}
