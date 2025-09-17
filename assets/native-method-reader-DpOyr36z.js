import { B as Bean, f as fallbackPos, I as INVALID } from "./index-DyTq3Mxn.js";
import { N as NativeMethod } from "./native-method-Bk5GnIMw.js";
import { I as Identifier } from "./identifier-DiJZGL4m.js";
import { K as Keyword } from "./keyword-DRNOSLz1.js";
import { S as Separator } from "./separator-DxWjJeA5.js";
import "./method-7GHRjHkK.js";
import "./symbol-B09mnHSj.js";
import "./token-ofOFEBrc.js";
class NativeMethodReader extends Bean {
  constructor(callableTypeReader) {
    super();
    this.callableTypeReader = callableTypeReader;
  }
  async read(c) {
    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, "native")) {
      return;
    }
    c.tokenReader.consume();
    const t2 = c.tokenReader.current;
    if (!Keyword.matches(t2, "function")) {
      c.parseErrors.addError(`Expected keyword "function"`, fallbackPos(t2 == null ? void 0 : t2.pos, t1.pos));
      return INVALID;
    }
    c.tokenReader.consume();
    const t3 = c.tokenReader.current;
    if (!Identifier.matches(t3)) {
      c.parseErrors.addError(`Expected function name`, fallbackPos(t3 == null ? void 0 : t3.pos, t2.pos));
      return INVALID;
    }
    c.tokenReader.consume();
    const t4 = c.tokenReader.current;
    const type = t4 && this.callableTypeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.parseErrors.addError(`Expected type`, fallbackPos(t4 == null ? void 0 : t4.pos, t3.pos));
      return INVALID;
    }
    const t5 = c.tokenReader.current;
    if (!Separator.matches(t5, ";")) {
      c.parseErrors.addError(`Expected ";"`, fallbackPos(t5 == null ? void 0 : t5.pos, type.pos));
      return INVALID;
    }
    c.tokenReader.consume();
    return new NativeMethod(c.currentModule, t3.name, type, t3.pos);
  }
}
export {
  NativeMethodReader
};
