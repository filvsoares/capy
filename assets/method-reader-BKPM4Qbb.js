import { g as Method, B as Bean, f as fallbackPos, E as ERROR, b as INVALID, h as NativeMethod, A as ArgumentVariable, C as CapyMethod } from "./index-s97_hl8g.js";
import { m as methodExtraKey } from "./method-extra-DbSJTGU1.js";
import { M as MethodStack } from "./method-stack-BoNwLixn.js";
import { B as Bracket } from "./bracket-CL1IELux.js";
import { I as Identifier } from "./identifier-CmniarI-.js";
import { K as Keyword } from "./keyword-8UUIU2rW.js";
import { S as Separator } from "./separator-DCoNiD5Y.js";
import "./extra-DGWX4UcI.js";
import "./token-YsknnliN.js";
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
    var _a;
    const t1 = c.current;
    const isNative = Keyword.matches(t1, "native");
    const isFunction = Keyword.matches(t1, "function");
    if (!isNative && !isFunction) {
      return;
    }
    c.consume();
    if (isNative) {
      const t22 = c.current;
      if (!Keyword.matches(t22, "function")) {
        c.addError({
          level: ERROR,
          message: `Expected "function"`,
          pos: fallbackPos(t22 == null ? void 0 : t22.pos, t1.pos)
        });
        return INVALID;
      }
      c.consume();
    }
    const t2 = c.current;
    if (!Identifier.matches(t2)) {
      c.addError({
        level: ERROR,
        message: `Expected string`,
        pos: fallbackPos(t2 == null ? void 0 : t2.pos, t1.pos)
      });
      return INVALID;
    }
    c.consume();
    const t3 = c.current;
    const type = t3 && this.callableTypeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.addError({
        level: ERROR,
        message: `Expected type`,
        pos: fallbackPos(t3 == null ? void 0 : t3.pos, t2.pos)
      });
      return INVALID;
    }
    const t4 = c.current;
    let tokenList;
    if (isNative) {
      if (!Separator.matches(t4, ";")) {
        c.addError({
          level: ERROR,
          message: `Expected ";" but found ${t4}`,
          pos: fallbackPos(t4 == null ? void 0 : t4.pos, type.pos)
        });
        return INVALID;
      }
    } else {
      if (!Bracket.matches(t4, "{")) {
        c.addError({
          level: ERROR,
          message: `Expected "{" but found ${t4}`,
          pos: fallbackPos(t4 == null ? void 0 : t4.pos, type.pos)
        });
        return INVALID;
      }
      tokenList = t4.tokenList;
    }
    c.consume();
    if (isNative) {
      const callback = (_a = c.moduleInput.extra.get(methodExtraKey)) == null ? void 0 : _a.nativeMethods[t2.name];
      if (!callback) {
        c.addError({
          level: ERROR,
          message: `Declared native function "${t2.name}" but native implementation was not found`,
          pos: fallbackPos(t4 == null ? void 0 : t4.pos, type.pos)
        });
        return INVALID;
      }
      return new NativeMethod(c.moduleName, t2.name, type, callback, t2.pos);
    }
    c.addTask(() => {
      const c1 = c.derive(tokenList);
      const stack = new MethodStack(null, type.returnType);
      for (let i = 0; i < type.argList.length; i++) {
        const arg = type.argList[i];
        stack.add(new ArgumentVariable(i, arg.name, arg.type, arg.pos));
      }
      const statementList = this.statementReader.readList(c1, stack);
      this.parser.replaceSymbol(c, new CapyMethod(c.moduleName, t2.name, type, stack.items, statementList, t2.pos));
    });
    return new UnresolvedMethod(c.moduleName, t2.name, type, t2.pos);
  }
}
export {
  MethodReader
};
