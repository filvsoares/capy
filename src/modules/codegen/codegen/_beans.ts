import { codegen } from '@/modules/codegen/codegen/codegen';
import { symbolProcessor } from '@/modules/codegen/codegen/symbol-processor';
import { declareBean, list } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'CodegenImpl',
    provides: [codegen],
    dependencies: [list(symbolProcessor)],
    loadModule: () => import('./codegen-impl'),
    factory: (m, deps) => new m.CodegenImpl(...deps),
  });
}
