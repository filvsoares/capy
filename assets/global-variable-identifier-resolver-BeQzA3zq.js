import { B as Bean, G as GlobalVariable, d as GlobalVariableReference } from "./index-s97_hl8g.js";
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
