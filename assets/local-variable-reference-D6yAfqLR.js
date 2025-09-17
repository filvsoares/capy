import { E as Expression } from "./expression-I5NqfmRI.js";
class LocalVariableReference extends Expression {
  constructor(index, name, type, pos) {
    super(type, pos);
    this.index = index;
    this.name = name;
  }
  get isReference() {
    return true;
  }
  toString() {
    return `local variable "${this.name}"`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}
`);
    out.push(`${prefix}  index: ${this.index}
`);
  }
}
export {
  LocalVariableReference as L
};
