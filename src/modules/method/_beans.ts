import { codegenHook } from '@/modules/codegen/codegen-hook';
import { symbolProcessor } from '@/modules/codegen/symbol-processor';
import { expressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { expressionProcessor } from '@/modules/expression/expression-processor';
import { expressionReader } from '@/modules/expression/expression-reader';
import { identifierResolver } from '@/modules/expression/identifier-resolver';
import { operationProcessor } from '@/modules/expression/operation-processor';
import { argumentReader } from '@/modules/method/argument-reader';
import { callableTypeReader } from '@/modules/method/callable-type-reader';
import { parser } from '@/modules/parser/parser';
import { parserHook } from '@/modules/parser/parser-hook';
import { toplevelReader } from '@/modules/parser/toplevel-reader';
import { statementItemProcessor } from '@/modules/statement/statement-item-processor';
import { statementItemReader } from '@/modules/statement/statement-item-reader';
import { statementProcessor } from '@/modules/statement/statement-processor';
import { statementReader } from '@/modules/statement/statement-reader';
import { typeItemReader } from '@/modules/type/type-item-reader';
import { typeReader } from '@/modules/type/type-reader';
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
  declareBean({
    name: 'LocalVariableReferenceProcessor',
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => import('./local-variable-reference-processor'),
    factory: (m, deps) => new m.LocalVariableReferenceProcessor(...deps),
  });
  declareBean({
    name: 'MethodCallProcessor',
    provides: [expressionItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => import('./cg-method-call-processor'),
    factory: (m, deps) => new m.MethodCallProcessor(...deps),
  });
  declareBean({
    name: 'MethodExtraWriter',
    provides: [codegenHook],
    dependencies: [],
    loadModule: () => import('./method-extra-writer'),
    factory: (m, deps) => new m.MethodExtraWriter(...deps),
  });
  declareBean({
    name: 'MethodLiteralProcessor',
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => import('./method-literal-processor'),
    factory: (m, deps) => new m.MethodLiteralProcessor(...deps),
  });
  declareBean({
    name: 'MethodSymbolProcessor',
    provides: [symbolProcessor],
    dependencies: [single(statementProcessor)],
    loadModule: () => import('./method-symbol-processor'),
    factory: (m, deps) => new m.MethodSymbolProcessor(...deps),
  });
  declareBean({
    name: 'ReturnStatementProcessor',
    provides: [statementItemProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => import('./return-statement-processor'),
    factory: (m, deps) => new m.ReturnStatementProcessor(...deps),
  });
}
