import { G as GlobalVariable } from "./global-variable-CUKWfMi2.js";
import { G as GlobalVariableReference } from "./global-variable-reference-DDCmF-Z4.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./symbol-CAVyxDMA.js";
import "./expression-gX919Tzj.js";
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
