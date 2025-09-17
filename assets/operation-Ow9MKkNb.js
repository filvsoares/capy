import { E as Expression } from "./expression-I5NqfmRI.js";
class Operation extends Expression {
  constructor(operand, type, pos) {
    super(type, pos);
    this.operand = operand;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
  }
}
export {
  Operation as O
};
