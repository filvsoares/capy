import { CgSymbol } from '@/modules/codegen/codegen/cg-symbol';
import { Application } from '@/modules/parser/parser/application';
import { ContextValue } from '@/util/context';

export type CodegenData = ContextValue<
  'codegenData',
  {
    application: Application;
    symbols: { [moduleName: string]: { [symbolName: string]: CgSymbol } };
    getSymbolJsName(moduleName: string, symbolName: string): string;
  }
>;

export function codegenData(
  application: Application,
  symbols: { [moduleName: string]: { [symbolName: string]: CgSymbol } }
): CodegenData {
  return {
    codegenData: {
      application,
      symbols,
      getSymbolJsName(moduleName, symbolName) {
        const symbol = symbols[moduleName]?.[symbolName];
        if (!symbol) {
          throw new Error(`Symbol ${symbolName} not found`);
        }
        return symbol.jsName;
      },
    },
  };
}
