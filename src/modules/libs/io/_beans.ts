import { library } from '@/modules/libs/base/library';
import { declareBean } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'Library:io',
    provides: [library],
    dependencies: [],
    loadModule: () => import('./io'),
    factory: (m, deps) => new m.LibraryIO(...deps),
  });
}
