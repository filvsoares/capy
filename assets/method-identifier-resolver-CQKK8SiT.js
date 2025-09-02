import { M as Method } from "./method-vXMUZt8y.js";
import { M as MethodLiteral } from "./method-literal-C8E8mbKA.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./symbol-CzF83rwI.js";
import "./expression-DdT-ttwU.js";
class MethodIdentifierResolver extends Bean {
  constructor(parser) {
    super();
    this.parser = parser;
  }
  resolveIdentifier(c, obj) {
    const symbol = this.parser.findSymbol(c, obj.name);
    if (symbol instanceof Method) {
      return new MethodLiteral(symbol.module, symbol.name, symbol.type, obj.pos);
    }
  }
}
export {
  MethodIdentifierResolver
};
