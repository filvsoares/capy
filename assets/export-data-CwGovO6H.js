import { d as declareExtraKey } from "./extra-Dqv87a62.js";
const exportData = declareExtraKey("ExportData");
class ExportData {
  constructor() {
    this.exportedSymbols = {};
    this.usingModules = {};
    this.usingSymbols = {};
  }
  addExportedSymbol(moduleName, symbolName) {
    let symbols = this.exportedSymbols[moduleName];
    if (!symbols) {
      symbols = this.exportedSymbols[moduleName] = [];
    }
    symbols.push(symbolName);
  }
  addUsingModule(moduleName, usingModuleName) {
    let modules = this.usingModules[moduleName];
    if (!modules) {
      modules = this.usingModules[moduleName] = [];
    }
    modules.push(usingModuleName);
  }
}
export {
  ExportData as E,
  exportData as e
};
