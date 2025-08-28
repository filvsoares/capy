import { B as Bean, f as fallbackPos, E as ERROR, b as INVALID, G as GlobalVariable, c as combinePos } from "./index-s97_hl8g.js";
import { I as Identifier } from "./identifier-CmniarI-.js";
import { K as Keyword } from "./keyword-8UUIU2rW.js";
import { O as Operator } from "./operator-BG3tGXnj.js";
import { S as Separator } from "./separator-DCoNiD5Y.js";
import "./token-YsknnliN.js";
class GlobalVariableReader extends Bean {
  constructor(typeReader, expressionReader) {
    super();
    this.typeReader = typeReader;
    this.expressionReader = expressionReader;
  }
  read(c) {
    const t1 = c.current;
    if (!Keyword.matches(t1, "var")) {
      return;
    }
    c.consume();
    const t2 = c.current;
    if (!Identifier.matches(t2)) {
      c.addError({
        level: ERROR,
        message: `Expected identifier`,
        pos: fallbackPos(t2 == null ? void 0 : t2.pos, t1.pos)
      });
      return INVALID;
    }
    c.consume();
    let t3 = c.current;
    if (!Operator.matches(t3, ":")) {
      c.addError({
        level: ERROR,
        message: `Expected ":"`,
        pos: fallbackPos(t3 == null ? void 0 : t3.pos, t2.pos)
      });
      return INVALID;
    }
    c.consume();
    const t4 = c.current;
    const type = t4 && this.typeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.addError({
        level: ERROR,
        message: `Expected type`,
        pos: fallbackPos(t4 == null ? void 0 : t4.pos, t3.pos)
      });
      return INVALID;
    }
    t3 = c.current;
    let initExpr = null;
    if (Operator.matches(t3, "=")) {
      c.consume();
      const t42 = c.current;
      const _initExpr = t42 && this.expressionReader.read(c, null);
      if (_initExpr === INVALID) {
        return INVALID;
      }
      if (!_initExpr) {
        c.addError({
          level: ERROR,
          message: `Expected initializer`,
          pos: fallbackPos(t42 == null ? void 0 : t42.pos, t3.pos)
        });
        return INVALID;
      }
      initExpr = _initExpr;
    }
    const t5 = c.current;
    if (Separator.matches(t5, ";")) {
      c.consume();
    } else {
      c.addError({
        level: ERROR,
        message: type === initExpr ? `Expected ";"` : `Expected "=" or ";"`,
        pos: fallbackPos(t5 == null ? void 0 : t5.pos, t3.pos)
      });
    }
    return new GlobalVariable(c.moduleName, t2.name, type, initExpr, combinePos(t1.pos, (t5 ?? t2).pos));
  }
}
export {
  GlobalVariableReader
};
