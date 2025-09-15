import { Context, ContextValue } from '@/util/context';

export type ExportData = ContextValue<
  'exportData',
  {
    exportedSymbols: {
      [moduleName: string]: string[];
    };
    usingModules: {
      [moduleName: string]: string[];
    };
    usingSymbols: {
      [moduleName: string]: {
        [symbolName: string]: {
          exportModuleName: string;
          exportSymbolName: string;
        };
      };
    };
    addExportedSymbol(moduleName: string, symbolName: string): void;
    addUsingModule(moduleName: string, usingModuleName: string): void;
  }
>;

export function exportData(): ExportData {
  return {
    exportData: {
      exportedSymbols: {},
      usingModules: {},
      usingSymbols: {},
      addExportedSymbol(moduleName, symbolName) {
        let symbols = this.exportedSymbols[moduleName];
        if (!symbols) {
          symbols = this.exportedSymbols[moduleName] = [];
        }
        symbols.push(symbolName);
      },
      addUsingModule(moduleName, usingModuleName) {
        let modules = this.usingModules[moduleName];
        if (!modules) {
          modules = this.usingModules[moduleName] = [];
        }
        modules.push(usingModuleName);
      },
    },
  };
}

export function assertExportData(c: Context<Partial<ExportData>>): asserts c is Context<ExportData> {}
