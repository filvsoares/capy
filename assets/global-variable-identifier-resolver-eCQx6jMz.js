import { G as GlobalVariable } from "./global-variable-DviImPNW.js";
import { G as GlobalVariableReference } from "./global-variable-reference-drp9uP7U.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./symbol-B09mnHSj.js";
import "./expression-BI_7gns1.js";
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
