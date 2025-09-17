import { B as Bean, I as INVALID } from "./index-BPYk8cqz.js";
import { S as Symbol$1 } from "./symbol-CAVyxDMA.js";
import { K as Keyword } from "./keyword-D76bTD-h.js";
import { e as exportData, E as ExportData } from "./export-data-CwGovO6H.js";
import { d as declareExtraKey } from "./extra-Dqv87a62.js";
import "./token-C93Hpdaz.js";
const inExport = declareExtraKey("InExport");
class ExportReader extends Bean {
  constructor(parser) {
    super();
    this.parser = parser;
  }
  onCreateContext(c) {
    exportData.addTo(c, new ExportData());
  }
  async read(c) {
    const _exportData = exportData.requireFrom(c);
    const _inExport = inExport.optionalFrom(c) ?? false;
    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, "export")) {
      return;
    }
    c.tokenReader.consume();
    if (_inExport) {
      c.parseErrors.addError(`'export' called twice`, t1.pos);
      return INVALID;
    }
    const symbol = await this.parser.readToplevel({ ...c, ...inExport.wrap(true) });
    if (!symbol) {
      c.parseErrors.addError(`Expected symbol after 'export'`, t1.pos);
      return INVALID;
    }
    if (symbol instanceof Symbol$1) {
      _exportData.addExportedSymbol(symbol.module, symbol.name);
    }
    return symbol;
  }
}
export {
  ExportReader
};
