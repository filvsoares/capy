import { B as Bean, f as fallbackPos, I as INVALID, b as combinePos } from "./index-3ZiCjh5_.js";
import { G as GlobalVariable } from "./global-variable-DI-dNkiR.js";
import { T as TokenReader } from "./token-reader-CWKbD-VP.js";
import { I as Identifier } from "./identifier-D67RqHyN.js";
import { K as Keyword } from "./keyword-BPOLCCDh.js";
import { O as Operator } from "./operator-BvOOTirp.js";
import { S as Separator } from "./separator-DUrKHX5w.js";
import "./symbol-CzSKJU1d.js";
import "./token-BtqAZLUf.js";
class GlobalVariableReader extends Bean {
  constructor(typeReader, expressionReader) {
    super();
    this.typeReader = typeReader;
    this.expressionReader = expressionReader;
  }
  async read(c) {
    var _a;
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
    const t3 = c.tokenReader.current;
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
    const obj = new GlobalVariable(c.currentModule, t2.name, type, null, combinePos(t1.pos, t4.pos));
    let hasInitExpr = false;
    const t5 = c.tokenReader.current;
    if (Operator.matches(t5, "=")) {
      hasInitExpr = true;
      c.tokenReader.consume();
      const initExpr = [];
      while (true) {
        const t6 = c.tokenReader.current;
        if (!t6 || Separator.matches(t6)) {
          break;
        }
        initExpr.push(t6);
        c.tokenReader.consume();
      }
      if (initExpr.length > 0) {
        c.parserData.addTask(() => {
          const _initExpr = this.expressionReader.read({ ...c, tokenReader: new TokenReader(initExpr) });
          if (!_initExpr) {
            c.parseErrors.addError(`Unexpected ${initExpr[0]}`, initExpr[0].pos);
            return;
          }
          if (_initExpr === INVALID) {
            return;
          }
          obj.initExpr = _initExpr;
        });
      } else {
        c.parseErrors.addError(`Expected expression`, (_a = c.tokenReader.current) == null ? void 0 : _a.pos);
      }
    }
    const t7 = c.tokenReader.current;
    if (Separator.matches(t7, ";")) {
      c.tokenReader.consume();
    } else {
      c.parseErrors.addError(hasInitExpr ? `Expected ";"` : `Expected "=" or ";"`, fallbackPos(t5 == null ? void 0 : t5.pos, t3.pos));
    }
    return obj;
  }
}
export {
  GlobalVariableReader
};
