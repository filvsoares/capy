import { declareBean, list, single } from '@/util/beans';
import { l2TypeReader } from './l2-type-reader';
import { l2ArgumentReader } from './l2-argument-reader';
import { l2TypeItemReader } from './l2-type-item-reader';
import { l2CallableTypeReader } from './l2-callable-type-reader';

export function declareBeans() {
  declareBean({
    name: 'L2ArgumentReaderImpl',
    provides: [l2ArgumentReader],
    dependencies: [single(l2TypeReader)],
    loadModule: () => import('./l2-argument-reader-impl'),
    factory: (m, deps) => new m.L2ArgumentReaderImpl(deps),
  });
  declareBean({
    name: 'L2CallableTypeReader',
    provides: [l2TypeItemReader, l2CallableTypeReader],
    dependencies: [single(l2TypeReader), single(l2ArgumentReader)],
    loadModule: () => import('./l2-callable-type-reader-impl'),
    factory: (m, deps) => new m.L2CallableTypeReaderImpl(deps),
  });
  declareBean({
    name: 'L2SimpleTypeReader',
    provides: [l2TypeItemReader],
    dependencies: [],
    loadModule: () => import('./l2-simple-type-reader'),
    factory: (m) => new m.L2SimpleTypeReader(),
  });
  declareBean({
    name: 'L2TypeReaderImpl',
    provides: [l2TypeReader],
    dependencies: [list(l2TypeItemReader)],
    loadModule: () => import('./l2-type-reader-impl'),
    factory: (m, deps) => new m.L2TypeReaderImpl(deps),
  });
}
