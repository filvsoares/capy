import { codegen } from '@/modules/codegen/codegen';
import { codegenHook } from '@/modules/codegen/codegen-hook';
import { symbolProcessor } from '@/modules/codegen/symbol-processor';
import { declareBean, list } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'CodegenImpl',
    provides: [codegen],
    dependencies: [list(symbolProcessor), list(codegenHook)],
    loadModule: () => import('./codegen-impl'),
    factory: (m, deps) => new m.CodegenImpl(...deps),
  });
}
