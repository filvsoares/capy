import { B as Bean, q as isVoidType, c as combinePos, E as ERROR, b as INVALID, R as ReturnStatement, f as fallbackPos } from "./index-s97_hl8g.js";
import { K as Keyword } from "./keyword-8UUIU2rW.js";
import { S as Separator } from "./separator-DCoNiD5Y.js";
import "./token-YsknnliN.js";
class ReturnStatementReader extends Bean {
  constructor(expressionReader, typeReader) {
    super();
    this.expressionReader = expressionReader;
    this.typeReader = typeReader;
    this.priority = 100;
  }
  read(c, context) {
    const t1 = c.current;
    if (!Keyword.matches(t1, "return")) {
      return;
    }
    c.consume();
    const t2 = c.current;
    if (Separator.matches(t2, ";")) {
      c.consume();
      if (!isVoidType(context.returnType)) {
        c.addError({
          level: ERROR,
          message: `Must return expression of type ${context.returnType}`,
          pos: combinePos(t1.pos, t2.pos)
        });
        return INVALID;
      }
      return new ReturnStatement(null, combinePos(t1.pos, t2.pos));
    }
    const expr = this.expressionReader.read(c, context, {
      unexpectedTokenErrorMsg: (t) => `Expected expression but found ${t}`
    });
    if (expr === INVALID) {
      return INVALID;
    }
    if (!expr) {
      c.addError({
        level: ERROR,
        message: `Expected expression but found ${t2}`,
        pos: fallbackPos(t2 == null ? void 0 : t2.pos, t1.pos)
      });
      return INVALID;
    }
    const t3 = c.current;
    if (Separator.matches(t3, ";")) {
      c.consume();
    } else {
      c.addError({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t3 == null ? void 0 : t3.pos, expr.pos)
      });
    }
    if (isVoidType(context.returnType)) {
      c.addError({
        level: ERROR,
        message: `Cannot return expression when method has void return type`,
        pos: expr.pos
      });
      return INVALID;
    }
    if (!this.typeReader.isAssignable(expr.type, context.returnType)) {
      c.addError({
        level: ERROR,
        message: `Return expects ${context.returnType} but ${expr.type} was provided`,
        pos: expr.pos
      });
      return INVALID;
    }
    return new ReturnStatement(expr, combinePos(t1.pos, expr.pos));
  }
}
export {
  ReturnStatementReader
};
