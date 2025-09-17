import { O as Operation } from "./operation-CGef310c.js";
class Assignment extends Operation {
  constructor(operand, target, type, pos) {
    super(operand, type, pos);
    this.target = target;
  }
  toString() {
    return "assignment";
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  target: `);
    this.target.debugPrint(out, `${prefix}  `);
  }
}
export {
  Assignment as A
};
