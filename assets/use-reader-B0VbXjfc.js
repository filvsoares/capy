import { B as Bean, f as fallbackPos, E as ERROR, b as INVALID } from "./index-s97_hl8g.js";
import { K as Keyword } from "./keyword-8UUIU2rW.js";
import { S as String } from "./string-CeTwIwXK.js";
import { d as declareExtraKey } from "./extra-DGWX4UcI.js";
import { S as Separator } from "./separator-DCoNiD5Y.js";
import "./token-YsknnliN.js";
const useExtraKey = declareExtraKey();
class UseReader extends Bean {
  constructor(parser) {
    super();
    this.parser = parser;
  }
  read(c) {
    const t1 = c.current;
    if (!Keyword.matches(t1, "use")) {
      return;
    }
    c.consume();
    const t2 = c.current;
    if (!String.matches(t2)) {
      c.addError({
        level: ERROR,
        message: `Expected import name but found ${t2 == null ? void 0 : t2.constructor.name}`,
        pos: fallbackPos(t2 == null ? void 0 : t2.pos, t1.pos)
      });
      return INVALID;
    }
    c.consume();
    const t3 = c.current;
    if (Separator.matches(t3, ";")) {
      c.consume();
    } else {
      c.addError({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t3 == null ? void 0 : t3.pos, t2.pos)
      });
    }
    const module = this.parser.findModule(c, t2.value);
    if (!module) {
      c.addError({
        level: ERROR,
        message: `Module "${t2.value}" not found`,
        pos: t2.pos
      });
      return INVALID;
    }
    const useExtra = c.extra.getOrCreate(useExtraKey, () => ({ symbols: {} }));
    for (const symbolName in module) {
      let list = useExtra.symbols[symbolName];
      if (!list) {
        useExtra.symbols[symbolName] = list = [];
      }
      list.push({ moduleName: t2.value, value: module.symbols[symbolName] });
    }
    return true;
  }
}
export {
  UseReader
};
