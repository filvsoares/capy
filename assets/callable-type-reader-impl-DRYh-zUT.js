import { B as Bean, I as INVALID, b as combinePos } from "./index-3ZiCjh5_.js";
import { C as CallableType } from "./callable-type-s2fF9DZ6.js";
import { T as TokenReader } from "./token-reader-CWKbD-VP.js";
import { B as Bracket } from "./bracket-DyCPjpk6.js";
import { V as VOID } from "./simple-type-CKDhUhFe.js";
import { O as Operator } from "./operator-BvOOTirp.js";
import "./type-CXsu6tPh.js";
import "./token-BtqAZLUf.js";
class CallableTypeReaderImpl extends Bean {
  constructor(typeReader, argumentReader) {
    super();
    this.typeReader = typeReader;
    this.argumentReader = argumentReader;
  }
  read(c) {
    const t1 = c.tokenReader.current;
    if (!Bracket.matches(t1, "(")) {
      return;
    }
    c.tokenReader.consume();
    let returnType = VOID;
    const args = this.argumentReader.readList({ ...c, tokenReader: new TokenReader(t1.tokenList) });
    const t2 = c.tokenReader.current;
    if (Operator.matches(t2, ":")) {
      c.tokenReader.consume();
      const _returnType = this.typeReader.read(c);
      if (_returnType === INVALID) {
        return INVALID;
      }
      if (!_returnType) {
        c.parseErrors.addError(`Expected type`, t2.pos);
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
