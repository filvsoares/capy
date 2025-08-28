import { symbolProcessor } from '@/modules/codegen/codegen/symbol-processor';
import { declareBean } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'GlobalVariableSymbolProcessor',
    provides: [symbolProcessor],
    dependencies: [],
    loadModule: () => import('./global-variable-symbol-processor'),
    factory: (m, deps) => new m.GlobalVariableSymbolProcessor(...deps),
  });
}
