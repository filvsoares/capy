import { T as Token } from "./token-ofOFEBrc.js";
class Identifier extends Token {
  constructor(name, pos) {
    super(pos);
    this.name = name;
  }
  toString() {
    return `identifier "${this.name}"`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}
`);
  }
  static matches(token, value) {
    return token instanceof Identifier && (value === void 0 || token.name === value);
  }
}
export {
  Identifier as I
};
