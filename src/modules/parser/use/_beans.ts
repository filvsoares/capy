import { parser } from '@/modules/parser/parser/parser';
import { parserHook } from '@/modules/parser/parser/parser-hook';
import { toplevelReader } from '@/modules/parser/parser/toplevel-reader';
import { useProvider } from '@/modules/parser/use/use-provider';
import { declareBean, list, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'ExportReader',
    provides: [toplevelReader, parserHook],
    dependencies: [single(parser)],
    loadModule: () => import('./export-reader'),
    factory: (m, deps) => new m.ExportReader(...deps),
  });
  declareBean({
    name: 'UseReader',
    provides: [toplevelReader],
    dependencies: [list(useProvider)],
    loadModule: () => import('./use-reader'),
    factory: (m, deps) => new m.UseReader(...deps),
  });
}
