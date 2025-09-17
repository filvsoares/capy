import { O as Operation } from "./operation-Ow9MKkNb.js";
class MethodCall extends Operation {
  constructor(operand, argList, type, pos) {
    super(operand, type, pos);
    this.argList = argList;
  }
  toString() {
    return "method call";
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  argList:
`);
    this.argList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}
export {
  MethodCall as M
};
