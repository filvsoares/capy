import { B as Bean, f as fallbackPos, I as INVALID } from "./index-BPYk8cqz.js";
import { K as Keyword } from "./keyword-D76bTD-h.js";
import { S as Separator } from "./separator-BWSZyVah.js";
import { S as String } from "./string-BMju32Tu.js";
import { e as exportData } from "./export-data-CwGovO6H.js";
import "./token-C93Hpdaz.js";
import "./extra-Dqv87a62.js";
class UseReader extends Bean {
  constructor(useProviders) {
    super();
    this.useProviders = useProviders;
  }
  async read(c) {
    const _exportData = exportData.requireFrom(c);
    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, "use")) {
      return;
    }
    c.tokenReader.consume();
    const t2 = c.tokenReader.current;
    if (!String.matches(t2)) {
      c.parseErrors.addError(`Expected string but found ${t2}`, fallbackPos(t2 == null ? void 0 : t2.pos, t1.pos));
      return INVALID;
    }
    c.tokenReader.consume();
    const t3 = c.tokenReader.current;
    if (!Separator.matches(t3, ";")) {
      c.parseErrors.addError(`Expected ";" but found ${t3}`, fallbackPos(t3 == null ? void 0 : t3.pos, t2.pos));
    } else {
      c.tokenReader.consume();
    }
    let moduleName;
    for (const provider of this.useProviders) {
      moduleName = await provider.processUse(t2.value, c);
      if (moduleName) {
        break;
      }
    }
    if (!moduleName) {
      c.parseErrors.addError(`Could not find use reference '${t2.value}'`);
      return INVALID;
    }
    _exportData.addUsingModule(c.currentModule, moduleName);
    return true;
  }
}
export {
  UseReader
};
