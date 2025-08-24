import { l3TypeItemProcessor } from '@/beans/type/l3-type-item-processor';
import { declareBean, list } from '@/util/beans';
import { l2TypeItemReader } from './l2-type-item-reader';
import { l2TypeReader } from './l2-type-reader';
import { l3TypeProcessor } from './l3-type-processor';

export function declareBeans() {
  declareBean({
    name: 'L2SimpleTypeReader',
    provides: [l2TypeItemReader],
    dependencies: [],
    loadModule: () => import('./l2-simple-type-reader'),
    factory: (m, deps) => new m.L2SimpleTypeReader(...deps),
  });
  declareBean({
    name: 'L2TypeReaderImpl',
    provides: [l2TypeReader],
    dependencies: [list(l2TypeItemReader)],
    loadModule: () => import('./l2-type-reader-impl'),
    factory: (m, deps) => new m.L2TypeReaderImpl(...deps),
  });
  declareBean({
    name: 'L3SimpleTypeProcessor',
    provides: [l3TypeItemProcessor],
    dependencies: [],
    loadModule: () => import('./l3-simple-type-processor'),
    factory: (m, deps) => new m.L3SimpleTypeProcessor(...deps),
  });
  declareBean({
    name: 'L3TypeProcessorImpl',
    provides: [l3TypeProcessor],
    dependencies: [list(l3TypeItemProcessor)],
    loadModule: () => import('./l3-type-processor-impl'),
    factory: (m, deps) => new m.L3TypeProcessorImpl(...deps),
  });
}
