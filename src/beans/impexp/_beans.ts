import { declareBean } from '@/util/beans';
import { l2ToplevelReader } from '../l2-parser/l2-toplevel-reader';
import { l3ToplevelProcessor } from '../l3-parser/l3-toplevel-processor';

export function declareBeans() {
  declareBean({
    name: 'L2UseReader',
    provides: [l2ToplevelReader],
    dependencies: [],
    loadModule: () => import('./l2-use-reader'),
    factory: (m) => new m.L2UseReader(),
  });
  declareBean({
    name: 'L3UseProcessor',
    provides: [l3ToplevelProcessor],
    dependencies: [],
    loadModule: () => import('./l3-use-processor'),
    factory: (m) => new m.L3UseProcessor(),
  });
}
