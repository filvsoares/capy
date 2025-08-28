import { symbolProcessor } from '@/modules/codegen/codegen/symbol-processor';
import { declareBean } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'MethodSymbolProcessor',
    provides: [symbolProcessor],
    dependencies: [],
    loadModule: () => import('./method-symbol-processor'),
    factory: (m, deps) => new m.MethodSymbolProcessor(...deps),
  });
}
