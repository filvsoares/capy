import { E as Expression } from "./expression-I5NqfmRI.js";
class GlobalVariableReference extends Expression {
  constructor(module, name, type, pos) {
    super(type, pos);
    this.module = module;
    this.name = name;
  }
  get isReference() {
    return true;
  }
  toString() {
    return `identifier "${this.name}"`;
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
  GlobalVariableReference as G
};
