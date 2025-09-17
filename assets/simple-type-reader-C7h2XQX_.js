import { B as Bean, I as INVALID } from "./index-BPYk8cqz.js";
import { I as Identifier } from "./identifier-ClyZKQs9.js";
import { K as Keyword } from "./keyword-D76bTD-h.js";
import { b as SimpleType } from "./simple-type-KY6tNXlF.js";
import "./token-C93Hpdaz.js";
import "./type-Dxgg9cQE.js";
class SimpleTypeReader extends Bean {
  read(c) {
    const t1 = c.tokenReader.current;
    if (Keyword.matches(t1) || Identifier.matches(t1)) {
      c.tokenReader.consume();
      return this.process(c, t1.name, t1.pos);
    }
  }
  process(c, name, pos) {
    if (name === "string" || name === "number") {
      return new SimpleType(name, pos);
    }
    c.parseErrors.addError(`I still don't understand type "${name}"`, pos);
    return INVALID;
  }
  isAssignable(type, assignTo) {
    if (type instanceof SimpleType && assignTo instanceof SimpleType) {
      return type.primitive === assignTo.primitive;
    }
  }
}
export {
  SimpleTypeReader
};
