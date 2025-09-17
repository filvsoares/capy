import { M as Method } from "./method-DxMFOSUf.js";
import { M as MethodLiteral } from "./method-literal-CsR4Jik3.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./symbol-CzSKJU1d.js";
import "./expression-I5NqfmRI.js";
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
