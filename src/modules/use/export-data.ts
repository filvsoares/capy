import { declareExtraKey } from '@/util/extra';

export const exportData = declareExtraKey<ExportData>('ExportData');

export class ExportData {
  exportedSymbols: { [moduleName: string]: string[] } = {};
  usingModules: { [moduleName: string]: string[] } = {};
  usingSymbols: {
    [moduleName: string]: {
      [symbolName: string]: {
        exportModuleName: string;
        exportSymbolName: string;
      }[];
    };
  } = {};

  addExportedSymbol(moduleName: string, symbolName: string): void {
    let symbols = this.exportedSymbols[moduleName];
    if (!symbols) {
      symbols = this.exportedSymbols[moduleName] = [];
    }
    symbols.push(symbolName);
  }

  addUsingModule(moduleName: string, usingModuleName: string): void {
    let modules = this.usingModules[moduleName];
    if (!modules) {
      modules = this.usingModules[moduleName] = [];
    }
    modules.push(usingModuleName);
  }
}
