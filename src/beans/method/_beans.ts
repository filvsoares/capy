import { l3ExpressionProcessor } from '@/beans/expression/l3-expression-processor';
import { l2ArgumentReader } from '@/beans/method/l2-argument-reader';
import { l2CallableTypeReader } from '@/beans/method/l2-callable-type-reader';
import { l3CallableTypeProcessor } from '@/beans/method/l3-callable-type-processor';
import { l3StatementHandler } from '@/beans/statement/l3-statement-handler';
import { l2TypeItemReader } from '@/beans/type/l2-type-item-reader';
import { l2TypeReader } from '@/beans/type/l2-type-reader';
import { l3TypeItemProcessor } from '@/beans/type/l3-type-item-processor';
import { declareBean, single } from '@/util/beans';
import { l3ReferenceProcessor } from '../expression/l3-reference-processor';
import { l2ToplevelReader } from '../l2-parser/l2-toplevel-reader';
import { l3ToplevelProcessor } from '../l3-parser/l3-toplevel-processor';
import { l2StatementReader } from '../statement/l2-statement-reader';
import { l3StatementProcessor } from '../statement/l3-statement-processor';
import { l3TypeProcessor } from '../type/l3-type-processor';

export function declareBeans() {
  declareBean({
    name: 'L2ArgumentReaderImpl',
    provides: [l2ArgumentReader],
    dependencies: [single(l2TypeReader)],
    loadModule: () => import('./l2-argument-reader-impl'),
    factory: (m, deps) => new m.L2ArgumentReaderImpl(...deps),
  });
  declareBean({
    name: 'L2CallableTypeReader',
    provides: [l2TypeItemReader, l2CallableTypeReader],
    dependencies: [single(l2TypeReader), single(l2ArgumentReader)],
    loadModule: () => import('./l2-callable-type-reader-impl'),
    factory: (m, deps) => new m.L2CallableTypeReaderImpl(...deps),
  });
  declareBean({
    name: 'L2MethodReader',
    provides: [l2ToplevelReader],
    dependencies: [single(l2StatementReader), single(l2CallableTypeReader)],
    loadModule: () => import('./l2-method-reader'),
    factory: (m, deps) => new m.L2MethodReader(...deps),
  });
  declareBean({
    name: 'L3CallableTypeProcessorImpl',
    provides: [l3TypeItemProcessor, l3CallableTypeProcessor],
    dependencies: [single(l3TypeProcessor)],
    loadModule: () => import('./l3-callable-type-processor-impl'),
    factory: (m, deps) => new m.L3CallableTypeProcessorImpl(...deps),
  });
  declareBean({
    name: 'L3MethodProcessor',
    provides: [l3ToplevelProcessor],
    dependencies: [single(l3CallableTypeProcessor), single(l3StatementProcessor)],
    loadModule: () => import('./l3-method-processor'),
    factory: (m, deps) => new m.L3MethodProcessor(...deps),
  });
  declareBean({
    name: 'L3VariableReferenceProcessor',
    provides: [l3ReferenceProcessor],
    dependencies: [],
    loadModule: () => import('./l3-variable-reference-processor'),
    factory: (m) => new m.L3VariableReferenceProcessor(),
  });
  declareBean({
    name: 'L3VariableStatementHandler',
    provides: [l3StatementHandler],
    dependencies: [single(l3ExpressionProcessor), single(l3TypeProcessor)],
    loadModule: () => import('./l3-variable-statement-handler'),
    factory: (m, deps) => new m.L3VariableStatementHandler(...deps),
  });
}
