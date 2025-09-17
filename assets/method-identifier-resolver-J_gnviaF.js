import { M as Method } from "./method-7GHRjHkK.js";
import { M as MethodLiteral } from "./method-literal-P21cpdxF.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./symbol-B09mnHSj.js";
import "./expression-BI_7gns1.js";
class MethodIdentifierResolver extends Bean {
  constructor(parser) {
    super();
    this.parser = parser;
  }
  resolveIdentifier(c, name, origin) {
    const symbol = c.parserData.findSymbol(c.currentModule, name);
    if (symbol instanceof Method) {
      return new MethodLiteral(symbol.module, symbol.name, symbol.type, origin.pos);
    }
  }
}
export {
  MethodIdentifierResolver
};
