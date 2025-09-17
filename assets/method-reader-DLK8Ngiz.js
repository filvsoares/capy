import { B as Bean, f as fallbackPos, I as INVALID } from "./index-BPYk8cqz.js";
import { A as ArgumentVariable, C as CapyMethod } from "./capy-method-BPyyA8yv.js";
import { M as MethodData, m as methodData } from "./method-data-DniYLBB_.js";
import { M as Method } from "./method-DkaTFuoM.js";
import { T as TokenReader } from "./token-reader-CWKbD-VP.js";
import { B as Bracket } from "./bracket-CET9I_Ke.js";
import { I as Identifier } from "./identifier-ClyZKQs9.js";
import { K as Keyword } from "./keyword-D76bTD-h.js";
import "./local-variable-B09Bv3_O.js";
import "./extra-Dqv87a62.js";
import "./symbol-CAVyxDMA.js";
import "./token-C93Hpdaz.js";
class UnresolvedMethod extends Method {
  toString() {
    return "unresolved method";
  }
}
class MethodReader extends Bean {
  constructor(statementReader, callableTypeReader, parser) {
    super();
    this.statementReader = statementReader;
    this.callableTypeReader = callableTypeReader;
    this.parser = parser;
  }
  async read(c) {
    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, "function")) {
      return;
    }
    c.tokenReader.consume();
    const t2 = c.tokenReader.current;
    if (!Identifier.matches(t2)) {
      c.parseErrors.addError(`Expected string`, fallbackPos(t2 == null ? void 0 : t2.pos, t1.pos));
      return INVALID;
    }
    c.tokenReader.consume();
    const t3 = c.tokenReader.current;
    const type = t3 && this.callableTypeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.parseErrors.addError(`Expected type`, fallbackPos(t3 == null ? void 0 : t3.pos, t2.pos));
      return INVALID;
    }
    const t4 = c.tokenReader.current;
    if (!Bracket.matches(t4, "{")) {
      c.parseErrors.addError(`Expected "{" but found ${t4}`, fallbackPos(t4 == null ? void 0 : t4.pos, type.pos));
      return INVALID;
    }
    c.tokenReader.consume();
    c.parserData.addTask(() => {
      const _methodData = new MethodData(null, type.returnType);
      for (let i = 0; i < type.argList.length; i++) {
        const arg = type.argList[i];
        _methodData.add(new ArgumentVariable(i, arg.name, arg.type, arg.pos));
      }
      const c1 = {
        ...c,
        ...methodData.wrap(_methodData),
        tokenReader: new TokenReader(t4.tokenList)
      };
      const statementList = this.statementReader.readList(c1);
      c.parserData.replaceSymbol(
        new CapyMethod(c.currentModule, t2.name, type, _methodData.items, statementList, t2.pos)
      );
    });
    return new UnresolvedMethod(c.currentModule, t2.name, type, t2.pos);
  }
}
export {
  MethodReader
};
