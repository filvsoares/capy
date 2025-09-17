import { B as Bean, b as combinePos, I as INVALID, f as fallbackPos } from "./index-DyTq3Mxn.js";
import { m as methodData } from "./method-data-DniYLBB_.js";
import { R as ReturnStatement } from "./return-statement-DA0w9-qL.js";
import { K as Keyword } from "./keyword-DRNOSLz1.js";
import { i as isVoidType } from "./simple-type-DZbjR7se.js";
import { S as Separator } from "./separator-DxWjJeA5.js";
import "./extra-Dqv87a62.js";
import "./statement-1pRbB8Zx.js";
import "./token-ofOFEBrc.js";
import "./type-Cw01Jon0.js";
class ReturnStatementReader extends Bean {
  constructor(expressionReader, typeReader) {
    super();
    this.expressionReader = expressionReader;
    this.typeReader = typeReader;
    this.priority = 100;
  }
  read(c) {
    const md = methodData.optionalFrom(c);
    if (!md) {
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
      if (!isVoidType(md.returnType)) {
        c.parseErrors.addError(`Must return expression of type ${md.returnType}`, combinePos(t1.pos, t2.pos));
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
    if (isVoidType(md.returnType)) {
      c.parseErrors.addError(`Cannot return expression when method has void return type`, expr.pos);
      return INVALID;
    }
    if (!this.typeReader.isAssignable(expr.type, md.returnType)) {
      c.parseErrors.addError(`Return expects ${md.returnType} but ${expr.type} was provided`, expr.pos);
      return INVALID;
    }
    return new ReturnStatement(expr, combinePos(t1.pos, expr.pos));
  }
}
export {
  ReturnStatementReader
};
