import { E as Expression } from "./expression-DdT-ttwU.js";
import { S as STRING } from "./simple-type-BIm_59qh.js";
class StringLiteral extends Expression {
  constructor(value, pos) {
    super(STRING, pos);
    this.value = value;
  }
  toString() {
    return `string`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}
`);
  }
}
export {
  StringLiteral as S
};
