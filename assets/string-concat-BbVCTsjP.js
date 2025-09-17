import { O as Operation } from "./operation-ClDvK6AF.js";
class StringConcat extends Operation {
  constructor(operand, other, type, pos) {
    super(operand, type, pos);
    this.other = other;
  }
  toString() {
    return "string concat";
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  other: `);
    this.other.debugPrint(out, `${prefix}  `);
  }
}
export {
  StringConcat as S
};
