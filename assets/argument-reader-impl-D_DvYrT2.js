import { b as Base, B as Bean, f as fallbackPos, I as INVALID, g as combinePos, e as INTERNAL } from "./index-BncJlCxS.js";
import { I as Identifier } from "./identifier-CQkte7dE.js";
import { O as Operator } from "./operator-CJR6HJ2X.js";
import { S as Separator } from "./separator-D1CNARzn.js";
import "./token-YbVOofIc.js";
class Argument extends Base {
  constructor(name, type, pos) {
    super(pos);
    this.name = name;
    this.type = type;
  }
  toString() {
    return "argument";
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}
`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}
class ArgumentReaderImpl extends Bean {
  constructor(typeReader) {
    super();
    this.typeReader = typeReader;
  }
  read(c) {
    const t1 = c.tokenReader.current;
    if (!Identifier.matches(t1)) {
      return;
    }
    c.tokenReader.consume();
    const t2 = c.tokenReader.current;
    if (!Operator.matches(t2, ":")) {
      c.parseErrors.addError(`Expected ":" but found ${t2 ?? '")"'}`, fallbackPos(t2 == null ? void 0 : t2.pos, t1.pos));
      return INVALID;
    }
    c.tokenReader.consume();
    const t3 = c.tokenReader.current;
    const type = this.typeReader.read(c);
    if (!type) {
      c.parseErrors.addError(`Expected type but found ${t3}`, fallbackPos(t3 == null ? void 0 : t3.pos, t2.pos));
      return INVALID;
    }
    if (type === INVALID) {
      return INVALID;
    }
    return new Argument(t1.name, type, combinePos(t1.pos, type.pos));
  }
  readList(c) {
    const outList = [];
    let error = false;
    if (!c.tokenReader.current) {
      return outList;
    }
    while (c.tokenReader.current) {
      const arg = this.read(c);
      if (!arg) {
        if (!error) {
          error = true;
          c.parseErrors.addError(`Expected identifier`, INTERNAL);
        }
        c.tokenReader.consume();
        continue;
      }
      if (arg === INVALID) {
        continue;
      }
      outList.push(arg);
      const t2 = c.tokenReader.current;
      if (!t2) {
        break;
      }
      if (!Separator.matches(t2, ",")) {
        error = true;
        c.parseErrors.addError(`Expected "," but found ${t2}`, t2.pos);
        c.tokenReader.consume();
        continue;
      }
      c.tokenReader.consume();
      const t3 = c.tokenReader.current;
      if (!t3) {
        c.parseErrors.addError(`Expected argument after ","`, t2.pos);
        break;
      }
    }
    return outList;
  }
}
export {
  ArgumentReaderImpl
};
