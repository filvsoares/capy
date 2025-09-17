import { B as Bean, I as INVALID } from "./index-DyTq3Mxn.js";
import { I as Identifier } from "./identifier-DiJZGL4m.js";
import { K as Keyword } from "./keyword-DRNOSLz1.js";
import { b as SimpleType } from "./simple-type-DZbjR7se.js";
import "./token-ofOFEBrc.js";
import "./type-Cw01Jon0.js";
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
