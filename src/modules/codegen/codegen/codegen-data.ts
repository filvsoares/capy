import { CgSymbol } from '@/modules/codegen/codegen/cg-symbol';
import { Application } from '@/modules/parser/parser/application';
import { ContextValue } from '@/util/context';

export type CodegenData = ContextValue<
  'codegenData',
  {
    application: Application;
    modules: { [moduleName: string]: { [symbolName: string]: CgSymbol } };
    getSymbolJsName(moduleName: string, symbolName: string): string;
  }
>;

export function codegenData(
  application: Application,
  modules: { [moduleName: string]: { [symbolName: string]: CgSymbol } }
): CodegenData {
  return {
    codegenData: {
      application,
      modules,
      getSymbolJsName(moduleName, symbolName) {
        const symbol = modules[moduleName]?.[symbolName];
        if (!symbol) {
          throw new Error(`Symbol ${moduleName}/${symbolName} not found`);
        }
        return symbol.jsName;
      },
    },
  };
}
