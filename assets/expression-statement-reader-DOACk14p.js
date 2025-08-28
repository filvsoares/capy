import { B as Bean, b as INVALID, f as fallbackPos, E as ERROR, k as ExpressionStatement, c as combinePos } from "./index-s97_hl8g.js";
import { S as Separator } from "./separator-DCoNiD5Y.js";
import "./token-YsknnliN.js";
class ExpressionStatementReader extends Bean {
  constructor(expressionReader) {
    super();
    this.expressionReader = expressionReader;
    this.priority = -1e3;
  }
  read(c, context) {
    const val = this.expressionReader.read(c, context, {
      unexpectedTokenErrorMsg: (t2) => `Expected ";" but found ${t2}`
    });
    if (val === INVALID) {
      return INVALID;
    }
    if (!val) {
      return;
    }
    const t = c.current;
    if (Separator.matches(t, ";")) {
      c.consume();
    } else {
      c.addError({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t == null ? void 0 : t.pos, val.pos)
      });
    }
    return new ExpressionStatement(val, combinePos(val.pos, (t ?? val).pos));
  }
}
export {
  ExpressionStatementReader
};
