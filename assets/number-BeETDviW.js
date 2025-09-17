import { T as Token } from "./token-C93Hpdaz.js";
class Number extends Token {
  constructor(value, pos) {
    super(pos);
    this.value = value;
  }
  toString() {
    return `number "${this.value}"`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}
`);
  }
}
export {
  Number as N
};
