import { B as Bean, s as SimpleType, E as ERROR, b as INVALID } from "./index-s97_hl8g.js";
import { I as Identifier } from "./identifier-CmniarI-.js";
import { K as Keyword } from "./keyword-8UUIU2rW.js";
import "./token-YsknnliN.js";
class SimpleTypeReader extends Bean {
  read(c) {
    const t1 = c.current;
    if (Keyword.matches(t1) || Identifier.matches(t1)) {
      c.consume();
      return this.process(c, t1.name, t1.pos);
    }
  }
  process(c, name, pos) {
    if (name === "string" || name === "number") {
      return new SimpleType(name, pos);
    }
    c.addError({
      level: ERROR,
      message: `I still don't understand type "${name}"`,
      pos
    });
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
