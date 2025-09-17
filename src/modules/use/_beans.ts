import { expressionReader } from '@/modules/expression/expression-reader';
import { identifierResolver } from '@/modules/expression/identifier-resolver';
import { parser } from '@/modules/parser/parser';
import { parserHook } from '@/modules/parser/parser-hook';
import { toplevelReader } from '@/modules/parser/toplevel-reader';
import { useProvider } from '@/modules/use/use-provider';
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
    name: 'ImportedSymbolIdentifierResolver',
    provides: [identifierResolver],
    dependencies: [single(expressionReader)],
    loadModule: () => import('./imported-symbol-identifier-resolver'),
    factory: (m, deps) => new m.ImportedSymbolIdentifierResolver(...deps),
  });
  declareBean({
    name: 'UseReader',
    provides: [toplevelReader],
    dependencies: [list(useProvider)],
    loadModule: () => import('./use-reader'),
    factory: (m, deps) => new m.UseReader(...deps),
  });
}
