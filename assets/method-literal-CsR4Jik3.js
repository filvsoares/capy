import { E as Expression } from "./expression-I5NqfmRI.js";
class MethodLiteral extends Expression {
  constructor(module, name, type, pos) {
    super(type, pos);
    this.module = module;
    this.name = name;
  }
  toString() {
    return `method literal "${this.name}"`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  module: ${this.module}
`);
    out.push(`${prefix}  name: ${this.name}
`);
  }
}
export {
  MethodLiteral as M
};
