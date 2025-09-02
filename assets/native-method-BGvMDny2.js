import { L as LocalVariable } from "./local-variable-CyCoFzWG.js";
import { M as Method } from "./method-vXMUZt8y.js";
class ArgumentVariable extends LocalVariable {
  constructor(index, name, type, pos) {
    super(name, type, pos);
    this.index = index;
  }
  toString() {
    return "argument dependency";
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  index: ${this.index}
`);
  }
}
class CapyMethod extends Method {
  constructor(module, name, type, deps, statementList, pos) {
    super(module, name, type, pos);
    this.stack = deps;
    this.statementList = statementList;
  }
  toString() {
    return "method";
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  stack:
`);
    this.stack.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
    out.push(`${prefix}  statementList: `);
    this.statementList.debugPrint(out, `${prefix}  `);
  }
}
class NativeMethod extends Method {
  constructor(module, name, type, pos) {
    super(module, name, type, pos);
  }
  toString() {
    return "native method";
  }
}
export {
  ArgumentVariable as A,
  CapyMethod as C,
  NativeMethod as N
};
