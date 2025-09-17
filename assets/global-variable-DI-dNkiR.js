import { S as Symbol$1 } from "./symbol-CzSKJU1d.js";
class GlobalVariable extends Symbol$1 {
  constructor(module, name, type, initExpr, pos) {
    super(module, name, pos);
    this.type = type;
    this.initExpr = initExpr;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
    out.push(`${prefix}  initExpr: `);
    this.initExpr ? this.initExpr.debugPrint(out, `${prefix}  `) : out.push("(none)\n");
  }
  toString() {
    return `variable "${this.name}"`;
  }
}
export {
  GlobalVariable as G
};
