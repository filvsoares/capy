import { declareBean } from '@/util/beans';
import { l2TypeReader } from './l2-type-reader';
import { l2ArgumentReader } from './l2-argument-reader';
import { l2TypeItemReader } from './l2-type-item-reader';
import { l2CallableTypeReader } from './l2-callable-type-reader';

export function declareBeans() {
  declareBean({
    name: 'L2ArgumentReaderImpl',
    provides: [l2ArgumentReader],
    consumes: [l2TypeReader],
    loadModule: () => import('./l2-argument-reader-impl'),
    factory: (m, deps) => new m.L2ArgumentReaderImpl(deps),
  });
  declareBean({
    name: 'L2CallableTypeReader',
    provides: [l2TypeItemReader, l2CallableTypeReader],
    consumes: [l2TypeReader, l2ArgumentReader],
    loadModule: () => import('./l2-callable-type-reader-impl'),
    factory: (m, deps) => new m.L2CallableTypeReaderImpl(deps),
  });
  declareBean({
    name: 'L2SimpleTypeReader',
    provides: [l2TypeItemReader],
    consumes: [l2TypeReader, l2ArgumentReader],
    loadModule: () => import('./l2-simple-type-reader'),
    factory: (m) => new m.L2SimpleTypeReader(),
  });
  declareBean({
    name: 'L2SimpleTypeReader',
    provides: [l2TypeReader],
    consumes: [l2TypeItemReader],
    loadModule: () => import('./l2-type-reader-impl'),
    factory: (m, deps) => new m.L2TypeReaderImpl(deps),
  });
}
