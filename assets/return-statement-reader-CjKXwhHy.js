import { B as Bean, g as combinePos, I as INVALID, f as fallbackPos } from "./index-BncJlCxS.js";
import { h as hasMethodData } from "./method-data-BJ-mjRhZ.js";
import { R as ReturnStatement } from "./return-statement-DSXc-g5D.js";
import { K as Keyword } from "./keyword-DP2VjTYJ.js";
import { i as isVoidType } from "./simple-type-BIm_59qh.js";
import { S as Separator } from "./separator-D1CNARzn.js";
import "./statement-BEQNu2Pd.js";
import "./token-YbVOofIc.js";
import "./type-CuPJgnn0.js";
class ReturnStatementReader extends Bean {
  constructor(expressionReader, typeReader) {
    super();
    this.expressionReader = expressionReader;
    this.typeReader = typeReader;
    this.priority = 100;
  }
  read(c) {
    if (!hasMethodData(c)) {
      return;
    }
    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, "return")) {
      return;
    }
    c.tokenReader.consume();
    const t2 = c.tokenReader.current;
    if (Separator.matches(t2, ";")) {
      c.tokenReader.consume();
      if (!isVoidType(c.methodData.returnType)) {
        c.parseErrors.addError(`Must return expression of type ${c.methodData.returnType}`, combinePos(t1.pos, t2.pos));
        return INVALID;
      }
      return new ReturnStatement(null, combinePos(t1.pos, t2.pos));
    }
    const expr = this.expressionReader.read(c, {
      unexpectedTokenErrorMsg: (t) => `Expected expression but found ${t}`
    });
    if (expr === INVALID) {
      return INVALID;
    }
    if (!expr) {
      c.parseErrors.addError(`Expected expression but found ${t2}`, fallbackPos(t2 == null ? void 0 : t2.pos, t1.pos));
      return INVALID;
    }
    const t3 = c.tokenReader.current;
    if (Separator.matches(t3, ";")) {
      c.tokenReader.consume();
    } else {
      c.parseErrors.addError(`Expected ";"`, fallbackPos(t3 == null ? void 0 : t3.pos, expr.pos));
    }
    if (isVoidType(c.methodData.returnType)) {
      c.parseErrors.addError(`Cannot return expression when method has void return type`, expr.pos);
      return INVALID;
    }
    if (!this.typeReader.isAssignable(expr.type, c.methodData.returnType)) {
      c.parseErrors.addError(`Return expects ${c.methodData.returnType} but ${expr.type} was provided`, expr.pos);
      return INVALID;
    }
    return new ReturnStatement(expr, combinePos(t1.pos, expr.pos));
  }
}
export {
  ReturnStatementReader
};
