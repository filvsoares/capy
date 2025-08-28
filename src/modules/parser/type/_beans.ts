import { declareBean, list } from '@/util/beans';
import { typeItemReader } from './type-item-reader';
import { typeReader } from './type-reader';

export function declareBeans() {
  declareBean({
    name: 'SimpleTypeReader',
    provides: [typeItemReader],
    dependencies: [],
    loadModule: () => import('./simple-type-reader'),
    factory: (m, deps) => new m.SimpleTypeReader(...deps),
  });
  declareBean({
    name: 'TypeReaderImpl',
    provides: [typeReader],
    dependencies: [list(typeItemReader)],
    loadModule: () => import('./type-reader-impl'),
    factory: (m, deps) => new m.TypeReaderImpl(...deps),
  });
  declareBean({
    name: 'SimpleTypeReader',
    provides: [typeItemReader],
    dependencies: [],
    loadModule: () => import('./simple-type-reader'),
    factory: (m, deps) => new m.SimpleTypeReader(...deps),
  });
}
