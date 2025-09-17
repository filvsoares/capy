import { B as Bean, I as INVALID } from "./index-DyTq3Mxn.js";
import { e as exportData } from "./export-data-CwGovO6H.js";
import "./extra-Dqv87a62.js";
class ImportedSymbolIdentifierResolver extends Bean {
  constructor(expressionReader) {
    super();
    this.expressionReader = expressionReader;
    this.priority = -100;
  }
  resolveIdentifier(c, name, origin) {
    const _exportData = exportData.requireFrom(c);
    let usingSymbols = _exportData.usingSymbols[c.currentModule];
    if (!usingSymbols) {
      usingSymbols = _exportData.usingSymbols[c.currentModule] = {};
      for (const moduleName of _exportData.usingModules[c.currentModule] ?? []) {
        for (const symbolName of _exportData.exportedSymbols[moduleName] ?? []) {
          let symbols2 = usingSymbols[symbolName];
          if (!symbols2) {
            symbols2 = usingSymbols[symbolName] = [];
          }
          symbols2.push({
            exportModuleName: moduleName,
            exportSymbolName: symbolName
          });
        }
      }
    }
    const symbols = usingSymbols[name];
    if (!symbols) {
      return;
    }
    if (symbols.length > 1) {
      c.parseErrors.addError(
        `Ambiguous imported reference '${name}', exported in modules '${symbols.map((s) => s.exportModuleName).join(`', '`)}'`,
        origin.pos
      );
      return INVALID;
    }
    const symbol = symbols[0];
    return this.expressionReader.resolveIdentifier(
      { ...c, currentModule: symbol.exportModuleName },
      symbol.exportSymbolName,
      origin
    );
  }
}
export {
  ImportedSymbolIdentifierResolver
};
