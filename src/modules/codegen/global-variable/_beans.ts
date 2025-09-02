import { symbolProcessor } from '@/modules/codegen/codegen/symbol-processor';
import { expressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { declareBean } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'GlobalVariableReferenceProcessor',
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => import('./global-variable-reference-processor'),
    factory: (m, deps) => new m.GlobalVariableReferenceProcessor(...deps),
  });
  declareBean({
    name: 'GlobalVariableSymbolProcessor',
    provides: [symbolProcessor],
    dependencies: [],
    loadModule: () => import('./global-variable-symbol-processor'),
    factory: (m, deps) => new m.GlobalVariableSymbolProcessor(...deps),
  });
}
