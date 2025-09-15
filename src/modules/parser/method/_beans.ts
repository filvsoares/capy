import { expressionReader } from '@/modules/parser/expression/expression-reader';
import { identifierResolver } from '@/modules/parser/expression/identifier-resolver';
import { operationProcessor } from '@/modules/parser/expression/operation-processor';
import { argumentReader } from '@/modules/parser/method/argument-reader';
import { callableTypeReader } from '@/modules/parser/method/callable-type-reader';
import { parser } from '@/modules/parser/parser/parser';
import { parserHook } from '@/modules/parser/parser/parser-hook';
import { toplevelReader } from '@/modules/parser/parser/toplevel-reader';
import { statementItemReader } from '@/modules/parser/statement/statement-item-reader';
import { statementReader } from '@/modules/parser/statement/statement-reader';
import { typeItemReader } from '@/modules/parser/type/type-item-reader';
import { typeReader } from '@/modules/parser/type/type-reader';
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
    name: 'MethodParserCheck',
    provides: [parserHook],
    dependencies: [],
    loadModule: () => import('./method-parser-check'),
    factory: (m, deps) => new m.MethodParserCheck(...deps),
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
    name: 'ReturnStatementReader',
    provides: [statementItemReader],
    dependencies: [single(expressionReader), single(typeReader)],
    loadModule: () => import('./return-statement-reader'),
    factory: (m, deps) => new m.ReturnStatementReader(...deps),
  });
  declareBean({
    name: 'LocalVariableIdentifierResolver',
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
