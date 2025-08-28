import { C as CallableType } from "./callable-type-DoqtKxk0.js";
import { B as Bracket } from "./bracket-CL1IELux.js";
import { B as Bean, b as INVALID, E as ERROR, V as VOID, c as combinePos } from "./index-s97_hl8g.js";
import { O as Operator } from "./operator-BG3tGXnj.js";
import "./token-YsknnliN.js";
class CallableTypeReaderImpl extends Bean {
  constructor(typeReader, argumentReader) {
    super();
    this.typeReader = typeReader;
    this.argumentReader = argumentReader;
  }
  read(c) {
    const t1 = c.current;
    if (!Bracket.matches(t1, "(")) {
      return;
    }
    c.consume();
    let returnType = VOID;
    const c1 = c.derive(t1.tokenList);
    const args = this.argumentReader.readList(c1);
    const t2 = c.current;
    if (Operator.matches(t2, ":")) {
      c.consume();
      const _returnType = this.typeReader.read(c);
      if (_returnType === INVALID) {
        return INVALID;
      }
      if (!_returnType) {
        c.addError({
          level: ERROR,
          message: `Expected type`,
          pos: t2.pos
        });
        return INVALID;
      }
      returnType = _returnType;
    }
    return new CallableType(args, returnType, combinePos(t1.pos, (returnType ?? t1).pos));
  }
  isAssignable(type, assignTo) {
    if (type instanceof CallableType && assignTo instanceof CallableType) {
      if (!this.typeReader.isAssignable(type.returnType, assignTo.returnType)) {
        return false;
      }
      if (type.argList.length !== assignTo.argList.length) {
        return false;
      }
      for (let i = 0; i < type.argList.length; i++) {
        if (!this.typeReader.isAssignable(type.argList[i].type, assignTo.argList[i].type)) {
          return false;
        }
      }
      return true;
    }
  }
}
export {
  CallableTypeReaderImpl
};
