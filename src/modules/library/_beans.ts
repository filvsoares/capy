import { codegenHook } from '@/modules/codegen/codegen-hook';
import { symbolProcessor } from '@/modules/codegen/symbol-processor';
import { callableTypeReader } from '@/modules/method/callable-type-reader';
import { toplevelReader } from '@/modules/parser/toplevel-reader';
import { runnerArgsProvider } from '@/modules/runner/runner-args-provider';
import { useProvider } from '@/modules/use/use-provider';
import { declareBean, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'LibraryUseProvider',
    provides: [useProvider],
    dependencies: [],
    loadModule: () => import('./library-use-provider'),
    factory: (m, deps) => new m.LibraryUseProvider(...deps),
  });
  declareBean({
    name: 'NativeMethodReader',
    provides: [toplevelReader],
    dependencies: [single(callableTypeReader)],
    loadModule: () => import('./native-method-reader'),
    factory: (m, deps) => new m.NativeMethodReader(...deps),
  });
  declareBean({
    name: 'NativeMethodSymbolProcessor',
    provides: [symbolProcessor, codegenHook],
    dependencies: [],
    loadModule: () => import('./native-method-symbol-processor'),
    factory: (m, deps) => new m.NativeMethodSymbolProcessor(...deps),
  });
  declareBean({
    name: 'LibraryRunnerArgsProvider',
    provides: [runnerArgsProvider],
    dependencies: [],
    loadModule: () => import('./library-runner-args-provider'),
    factory: (m, deps) => new m.LibraryRunnerArgsProvider(...deps),
  });
}
