import { codegen } from '@/modules/codegen/codegen';
import { codegenExtraWriter } from '@/modules/codegen/codegen-extra-writer';
import { symbolProcessor } from '@/modules/codegen/symbol-processor';
import { declareBean, list } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'CodegenImpl',
    provides: [codegen],
    dependencies: [list(symbolProcessor), list(codegenExtraWriter)],
    loadModule: () => import('./codegen-impl'),
    factory: (m, deps) => new m.CodegenImpl(...deps),
  });
}
