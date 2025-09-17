import { E as Expression } from "./expression-BI_7gns1.js";
import { S as STRING } from "./simple-type-DZbjR7se.js";
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
