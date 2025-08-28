import { e as Base, B as Bean, f as fallbackPos, E as ERROR, b as INVALID, c as combinePos, I as INTERNAL } from "./index-s97_hl8g.js";
import { I as Identifier } from "./identifier-CmniarI-.js";
import { O as Operator } from "./operator-BG3tGXnj.js";
import { S as Separator } from "./separator-DCoNiD5Y.js";
import "./token-YsknnliN.js";
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
    const t1 = c.current;
    if (!Identifier.matches(t1)) {
      return;
    }
    c.consume();
    const t2 = c.current;
    if (!Operator.matches(t2, ":")) {
      c.addError({
        level: ERROR,
        message: `Expected ":" but found ${t2 ?? '")"'}`,
        pos: fallbackPos(t2 == null ? void 0 : t2.pos, t1.pos)
      });
      return INVALID;
    }
    c.consume();
    const t3 = c.current;
    const type = this.typeReader.read(c);
    if (!type) {
      c.addError({
        level: ERROR,
        message: `Expected type but found ${t3}`,
        pos: fallbackPos(t3 == null ? void 0 : t3.pos, t2.pos)
      });
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
    if (!c.current) {
      return outList;
    }
    while (c.current) {
      const arg = this.read(c);
      if (!arg) {
        if (!error) {
          error = true;
          c.addError({
            level: ERROR,
            message: `Expected identifier`,
            pos: INTERNAL
          });
        }
        c.consume();
        continue;
      }
      if (arg === INVALID) {
        continue;
      }
      outList.push(arg);
      const t2 = c.current;
      if (!t2) {
        break;
      }
      if (!Separator.matches(t2, ",")) {
        error = true;
        c.addError({
          level: ERROR,
          message: `Expected "," but found ${t2}`,
          pos: t2.pos
        });
        c.consume();
        continue;
      }
      c.consume();
      const t3 = c.current;
      if (!t3) {
        c.addError({
          level: ERROR,
          message: `Expected argument after ","`,
          pos: t2.pos
        });
        break;
      }
    }
    return outList;
  }
}
export {
  ArgumentReaderImpl
};
