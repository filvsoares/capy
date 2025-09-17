import { M as Method } from "./method-DkaTFuoM.js";
import { M as MethodLiteral } from "./method-literal-zZT4y-pX.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./symbol-CAVyxDMA.js";
import "./expression-gX919Tzj.js";
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
