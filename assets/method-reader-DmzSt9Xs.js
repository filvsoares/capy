import { B as Bean, f as fallbackPos, I as INVALID } from "./index-BncJlCxS.js";
import { N as NativeMethod, A as ArgumentVariable, C as CapyMethod } from "./native-method-BGvMDny2.js";
import { m as methodData } from "./method-data-BJ-mjRhZ.js";
import { M as Method } from "./method-vXMUZt8y.js";
import { t as tokenReader } from "./token-reader-BG65ZNxm.js";
import { B as Bracket } from "./bracket-BTNv1ZF5.js";
import { I as Identifier } from "./identifier-CQkte7dE.js";
import { K as Keyword } from "./keyword-DP2VjTYJ.js";
import { S as Separator } from "./separator-D1CNARzn.js";
import "./local-variable-CyCoFzWG.js";
import "./symbol-CzF83rwI.js";
import "./token-YbVOofIc.js";
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
  read(c) {
    const t1 = c.tokenReader.current;
    const isNative = Keyword.matches(t1, "native");
    const isFunction = Keyword.matches(t1, "function");
    if (!isNative && !isFunction) {
      return;
    }
    c.tokenReader.consume();
    if (isNative) {
      const t22 = c.tokenReader.current;
      if (!Keyword.matches(t22, "function")) {
        c.parseErrors.addError(`Expected "function"`, fallbackPos(t22 == null ? void 0 : t22.pos, t1.pos));
        return INVALID;
      }
      c.tokenReader.consume();
    }
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
    let tokenList;
    if (isNative) {
      if (!Separator.matches(t4, ";")) {
        c.parseErrors.addError(`Expected ";" but found ${t4}`, fallbackPos(t4 == null ? void 0 : t4.pos, type.pos));
        return INVALID;
      }
    } else {
      if (!Bracket.matches(t4, "{")) {
        c.parseErrors.addError(`Expected "{" but found ${t4}`, fallbackPos(t4 == null ? void 0 : t4.pos, type.pos));
        return INVALID;
      }
      tokenList = t4.tokenList;
    }
    c.tokenReader.consume();
    if (isNative) {
      return new NativeMethod(c.currentModule, t2.name, type, t2.pos);
    }
    c.parserData.addTask(() => {
      const c1 = c.with(tokenReader(tokenList)).with(methodData(null, type.returnType));
      for (let i = 0; i < type.argList.length; i++) {
        const arg = type.argList[i];
        c1.methodData.add(new ArgumentVariable(i, arg.name, arg.type, arg.pos));
      }
      const statementList = this.statementReader.readList(c1);
      this.parser.replaceSymbol(
        c,
        new CapyMethod(c.currentModule, t2.name, type, c1.methodData.items, statementList, t2.pos)
      );
    });
    return new UnresolvedMethod(c.currentModule, t2.name, type, t2.pos);
  }
}
export {
  MethodReader
};
