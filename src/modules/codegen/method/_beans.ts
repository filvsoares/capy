import { codegenExtraWriter } from '@/modules/codegen/codegen/codegen-extra-writer';
import { symbolProcessor } from '@/modules/codegen/codegen/symbol-processor';
import { expressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { expressionProcessor } from '@/modules/codegen/expression/expression-processor';
import { statementItemProcessor } from '@/modules/codegen/statement/statement-item-processor';
import { statementProcessor } from '@/modules/codegen/statement/statement-processor';
import { declareBean, single } from '@/util/beans';

export function declareBeans() {
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
    loadModule: () => import('./method-call-processor'),
    factory: (m, deps) => new m.MethodCallProcessor(...deps),
  });
  declareBean({
    name: 'MethodCallProcessor',
    provides: [codegenExtraWriter],
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
