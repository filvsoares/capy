import { expressionReader } from '@/beans/expression/expression-reader';
import { referenceProcessor } from '@/beans/expression/reference-processor';
import { argumentReader } from '@/beans/method/argument-reader';
import { callableTypeReader } from '@/beans/method/callable-type-reader';
import { parser } from '@/beans/parser/parser';
import { toplevelReader } from '@/beans/parser/toplevel-reader';
import { statementItemReader } from '@/beans/statement/statement-item-reader';
import { statementReader } from '@/beans/statement/statement-reader';
import { typeItemReader } from '@/beans/type/type-item-reader';
import { typeReader } from '@/beans/type/type-reader';
import { declareBean, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'ArgumentReaderImpl',
    provides: [argumentReader],
    dependencies: [single(typeReader)],
    loadModule: () => import('./argument-reader-impl'),
    factory: (m, deps) => new m.ArgumentReaderImpl(...deps),
  });
  declareBean({
    name: 'CallableTypeReaderImpl',
    provides: [typeItemReader, callableTypeReader],
    dependencies: [single(typeReader), single(argumentReader)],
    loadModule: () => import('./callable-type-reader-impl'),
    factory: (m, deps) => new m.CallableTypeReaderImpl(...deps),
  });
  declareBean({
    name: 'MethodReader',
    provides: [toplevelReader],
    dependencies: [single(statementReader), single(callableTypeReader), single(parser)],
    loadModule: () => import('./method-reader'),
    factory: (m, deps) => new m.MethodReader(...deps),
  });
  declareBean({
    name: 'VariableReferenceProcessor',
    provides: [referenceProcessor],
    dependencies: [single(parser)],
    loadModule: () => import('./variable-reference-processor'),
    factory: (m, deps) => new m.VariableReferenceProcessor(...deps),
  });
  declareBean({
    name: 'VariableStatementReader',
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => import('./variable-statement-handler'),
    factory: (m, deps) => new m.VariableStatementReader(...deps),
  });
}
