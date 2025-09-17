import { L as LocalVariableReference } from "./local-variable-reference-DRLazM8o.js";
import { m as methodData } from "./method-data-DniYLBB_.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./expression-gX919Tzj.js";
import "./extra-Dqv87a62.js";
class LocalVariableIdentifierResolver extends Bean {
  constructor(parser) {
    super();
    this.parser = parser;
    this.priority = 1e3;
  }
  resolveIdentifier(c, name, origin) {
    const md = methodData.optionalFrom(c);
    if (!md) {
      return;
    }
    const index = md.find(name);
    if (index !== void 0) {
      const dep = md.items[index];
      return new LocalVariableReference(index, dep.name, dep.type, origin.pos);
    }
  }
}
export {
  LocalVariableIdentifierResolver
};
