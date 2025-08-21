import { declareBean, list, single } from '@/util/beans';
import { l2ExpressionReader } from '../expression/l2-expression-reader';
import { l3ExpressionProcessor } from '../expression/l3-expression-processor';
import { l3TypeProcessor } from '../type/l3-type-processor';
import { l2StatementItemReader } from './l2-statement-item-reader';
import { l2StatementReader } from './l2-statement-reader';
import { l3StatementProcessor } from './l3-statement-processor';

export function declareBeans() {
  declareBean({
    name: 'L2ExpressionStatementReader',
    provides: [l2StatementItemReader],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-expression-statement-reader'),
    factory: (m, deps) => new m.L2ExpressionStatementReader(deps),
  });
  declareBean({
    name: 'L2ReturnStatementReader',
    provides: [l2StatementItemReader],
    dependencies: [single(l2ExpressionReader)],
    loadModule: () => import('./l2-return-statement-reader'),
    factory: (m, deps) => new m.L2ReturnStatementReader(deps),
  });
  declareBean({
    name: 'L2StatementReaderImpl',
    provides: [l2StatementReader],
    dependencies: [list(l2StatementItemReader)],
    loadModule: () => import('./l2-statement-reader-impl'),
    factory: (m, deps) => new m.L2StatementReaderImpl(deps),
  });
  declareBean({
    name: 'L3StatementProcessorImpl',
    provides: [l3StatementProcessor],
    dependencies: [single(l3ExpressionProcessor), single(l3TypeProcessor)],
    loadModule: () => import('./l3-statement-processor-impl'),
    factory: (m, deps) => new m.L3StatementProcessorImpl(...deps),
  });
}
