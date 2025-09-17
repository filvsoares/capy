import { T as Token } from "./token-ofOFEBrc.js";
class Operator extends Token {
  constructor(value, pos) {
    super(pos);
    this.value = value;
  }
  toString() {
    return `operator "${this.value}"`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}
`);
  }
  static matches(token, value) {
    return token instanceof Operator && (value === void 0 || token.value === value);
  }
}
export {
  Operator as O
};
