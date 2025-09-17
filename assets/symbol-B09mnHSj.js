import { h as Base } from "./index-DyTq3Mxn.js";
class Toplevel extends Base {
}
let Symbol$1 = class Symbol extends Toplevel {
  constructor(module, name, pos) {
    super(pos);
    this.module = module;
    this.name = name;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  module: ${this.module}
`);
    out.push(`${prefix}  name: ${this.name}
`);
  }
};
export {
  Symbol$1 as S
};
