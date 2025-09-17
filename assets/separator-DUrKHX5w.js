import { T as Token } from "./token-BtqAZLUf.js";
class Separator extends Token {
  constructor(value, pos) {
    super(pos);
    this.value = value;
  }
  toString() {
    return `separator "${this.value}"`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}
`);
  }
  static matches(token, value) {
    return token instanceof Separator && (value === void 0 || token.value === value);
  }
}
export {
  Separator as S
};
