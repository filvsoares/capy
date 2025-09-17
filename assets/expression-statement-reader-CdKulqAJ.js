import { B as Bean, I as INVALID, f as fallbackPos, b as combinePos } from "./index-DyTq3Mxn.js";
import { E as ExpressionStatement } from "./expression-statement-s9BqjCE-.js";
import { S as Separator } from "./separator-DxWjJeA5.js";
import "./statement-1pRbB8Zx.js";
import "./token-ofOFEBrc.js";
class ExpressionStatementReader extends Bean {
  constructor(expressionReader) {
    super();
    this.expressionReader = expressionReader;
    this.priority = -1e3;
  }
  read(c) {
    const val = this.expressionReader.read(c, {
      unexpectedTokenErrorMsg: (t2) => `Expected ";" but found ${t2}`
    });
    if (val === INVALID) {
      return INVALID;
    }
    if (!val) {
      return;
    }
    const t = c.tokenReader.current;
    if (Separator.matches(t, ";")) {
      c.tokenReader.consume();
    } else {
      c.parseErrors.addError(`Expected ";"`, fallbackPos(t == null ? void 0 : t.pos, val.pos));
    }
    return new ExpressionStatement(val, combinePos(val.pos, (t ?? val).pos));
  }
}
export {
  ExpressionStatementReader
};
