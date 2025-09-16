import { useProvider } from '@/modules/use/use-provider';
import { declareBean } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'LibraryUseProvider',
    provides: [useProvider],
    dependencies: [],
    loadModule: () => import('./library-use-provider'),
    factory: (m, deps) => new m.LibraryUseProvider(...deps),
  });
}
