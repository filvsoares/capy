import { B as Bean, g as Method, i as MethodLiteral } from "./index-s97_hl8g.js";
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
