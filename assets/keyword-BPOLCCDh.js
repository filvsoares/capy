import { T as Token } from "./token-BtqAZLUf.js";
class Keyword extends Token {
  constructor(name, pos) {
    super(pos);
    this.name = name;
  }
  toString() {
    return `keyword "${this.name}"`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}
`);
  }
  static matches(token, value) {
    return token instanceof Keyword && (value === void 0 || token.name === value);
  }
}
export {
  Keyword as K
};
