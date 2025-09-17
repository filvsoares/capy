import { S as Symbol$1 } from "./symbol-CzSKJU1d.js";
class Method extends Symbol$1 {
  constructor(module, name, type, pos) {
    super(module, name, pos);
    this.type = type;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}
export {
  Method as M
};
