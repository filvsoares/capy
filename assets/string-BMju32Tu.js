import { T as Token } from "./token-C93Hpdaz.js";
class String extends Token {
  constructor(value, pos) {
    super(pos);
    this.value = value;
  }
  getName() {
    return "L1String";
  }
  toString() {
    return `string "${this.value}"`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}
`);
  }
  static matches(token, value) {
    return token instanceof String && (value === void 0 || token.value === value);
  }
}
export {
  String as S
};
