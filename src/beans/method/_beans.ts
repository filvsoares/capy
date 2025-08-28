import { expressionReader } from '@/beans/expression/expression-reader';
import { identifierResolver } from '@/beans/expression/identifier-resolver';
import { operationProcessor } from '@/beans/expression/operation-processor';
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
    name: 'MethodCallProcessor',
    provides: [operationProcessor],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => import('./method-call-processor'),
    factory: (m, deps) => new m.MethodCallProcessor(...deps),
  });
  declareBean({
    name: 'MethodReader',
    provides: [toplevelReader],
    dependencies: [single(statementReader), single(callableTypeReader), single(parser)],
    loadModule: () => import('./method-reader'),
    factory: (m, deps) => new m.MethodReader(...deps),
  });
  declareBean({
    name: 'MethodReferenceProcessor',
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => import('./method-identifier-resolver'),
    factory: (m, deps) => new m.MethodIdentifierResolver(...deps),
  });
  declareBean({
    name: 'VariableReferenceProcessor',
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => import('./local-variable-identifier-resolver'),
    factory: (m, deps) => new m.LocalVariableIdentifierResolver(...deps),
  });
  declareBean({
    name: 'LocalVariableStatementReader',
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => import('./local-variable-statement-handler'),
    factory: (m, deps) => new m.LocalVariableStatementReader(...deps),
  });
}
