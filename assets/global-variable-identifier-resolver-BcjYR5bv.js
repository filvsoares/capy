import { G as GlobalVariable } from "./global-variable-DI-dNkiR.js";
import { G as GlobalVariableReference } from "./global-variable-reference-Br-KxSDb.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./symbol-CzSKJU1d.js";
import "./expression-I5NqfmRI.js";
class GlobalVariableIdentifierResolver extends Bean {
  constructor(parser) {
    super();
    this.parser = parser;
  }
  resolveIdentifier(c, name, origin) {
    const symbol = c.parserData.findSymbol(c.currentModule, name);
    if (symbol instanceof GlobalVariable) {
      return new GlobalVariableReference(symbol.module, symbol.name, symbol.type, origin.pos);
    }
  }
}
export {
  GlobalVariableIdentifierResolver
};
