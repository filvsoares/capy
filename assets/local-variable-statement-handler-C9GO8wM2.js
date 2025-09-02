import { B as Bean, f as fallbackPos, I as INVALID } from "./index-BncJlCxS.js";
import { L as LocalVariable } from "./local-variable-CyCoFzWG.js";
import { L as LocalVariableReference } from "./local-variable-reference-CbLeQCuI.js";
import { h as hasMethodData } from "./method-data-BJ-mjRhZ.js";
import { A as Assignment } from "./assignment-eya3ith5.js";
import { E as ExpressionStatement } from "./expression-statement-DaAWbzNd.js";
import { I as Identifier } from "./identifier-CQkte7dE.js";
import { K as Keyword } from "./keyword-DP2VjTYJ.js";
import { O as Operator } from "./operator-CJR6HJ2X.js";
import { S as Separator } from "./separator-D1CNARzn.js";
import "./expression-DdT-ttwU.js";
import "./operation-DtccBRam.js";
import "./statement-BEQNu2Pd.js";
import "./token-YbVOofIc.js";
class LocalVariableStatementReader extends Bean {
  constructor(expressionReader, typeReader) {
    super();
    this.expressionReader = expressionReader;
    this.typeReader = typeReader;
  }
  read(c) {
    if (!hasMethodData(c)) {
      return;
    }
    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, "var")) {
      return;
    }
    c.tokenReader.consume();
    const t2 = c.tokenReader.current;
    if (!Identifier.matches(t2)) {
      c.parseErrors.addError(`Expected identifier`, fallbackPos(t2 == null ? void 0 : t2.pos, t1.pos));
      return INVALID;
    }
    c.tokenReader.consume();
    let t3 = c.tokenReader.current;
    if (!Operator.matches(t3, ":")) {
      c.parseErrors.addError(`Expected ":"`, fallbackPos(t3 == null ? void 0 : t3.pos, t2.pos));
      return INVALID;
    }
    c.tokenReader.consume();
    const t4 = c.tokenReader.current;
    const type = t4 && this.typeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.parseErrors.addError(`Expected type`, fallbackPos(t4 == null ? void 0 : t4.pos, t3.pos));
      return INVALID;
    }
    t3 = c.tokenReader.current;
    let initExpr = null;
    if (Operator.matches(t3, "=")) {
      c.tokenReader.consume();
      const t42 = c.tokenReader.current;
      const _initExpr = t42 && this.expressionReader.read(c);
      if (_initExpr === INVALID) {
        return INVALID;
      }
      if (!_initExpr) {
        c.parseErrors.addError(`Expected initializer`, fallbackPos(t42 == null ? void 0 : t42.pos, t3.pos));
        return INVALID;
      }
      initExpr = _initExpr;
    }
    const t5 = c.tokenReader.current;
    if (Separator.matches(t5, ";")) {
      c.tokenReader.consume();
    } else {
      c.parseErrors.addError(type === initExpr ? `Expected ";"` : `Expected "=" or ";"`, fallbackPos(t5 == null ? void 0 : t5.pos, t3.pos));
    }
    if (initExpr && !this.typeReader.isAssignable(initExpr.type, type)) {
      c.parseErrors.addError(`Variable has type "${type}" but initializer has type "${initExpr.type}"`, t2.pos);
    }
    const localVariable = new LocalVariable(t2.name, type, t2.pos);
    const index = c.methodData.add(localVariable);
    if (index === false) {
      c.parseErrors.addError(`Identifier "${t2.name}" already declared`, t2.pos);
      return INVALID;
    }
    if (initExpr) {
      return new ExpressionStatement(
        new Assignment(initExpr, new LocalVariableReference(index, t2.name, type, t2.pos), type, t2.pos),
        t2.pos
      );
    }
  }
}
export {
  LocalVariableStatementReader
};
