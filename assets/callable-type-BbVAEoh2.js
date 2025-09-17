import { T as Type } from "./type-Dxgg9cQE.js";
class CallableType extends Type {
  constructor(argList, returnType, pos) {
    super(pos);
    this.argList = argList;
    this.returnType = returnType;
  }
  toString() {
    return `type`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  argList:
`);
    this.argList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
    out.push(`${prefix}  returnType: `);
    this.returnType ? this.returnType.debugPrint(out, `${prefix}  `) : out.push("(void)\n");
  }
}
export {
  CallableType as C
};
