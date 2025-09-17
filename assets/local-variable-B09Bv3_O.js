import { h as Base } from "./index-BPYk8cqz.js";
class LocalVariable extends Base {
  constructor(name, type, pos) {
    super(pos);
    this.name = name;
    this.type = type;
  }
  toString() {
    return "local var";
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}
`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}
export {
  LocalVariable as L
};
