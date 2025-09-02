import { G as GlobalVariable } from "./global-variable-B4sLCCmC.js";
import { G as GlobalVariableReference } from "./global-variable-reference-TbOEZYtv.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./symbol-CzF83rwI.js";
import "./expression-DdT-ttwU.js";
class GlobalVariableIdentifierResolver extends Bean {
  constructor(parser) {
    super();
    this.parser = parser;
  }
  resolveIdentifier(c, obj) {
    const symbol = this.parser.findSymbol(c, obj.name);
    if (symbol instanceof GlobalVariable) {
      return new GlobalVariableReference(symbol.module, symbol.name, symbol.type, obj.pos);
    }
  }
}
export {
  GlobalVariableIdentifierResolver
};
