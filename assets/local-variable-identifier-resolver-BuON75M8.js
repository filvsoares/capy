import { L as LocalVariableReference } from "./local-variable-reference-D6yAfqLR.js";
import { m as methodData } from "./method-data-DniYLBB_.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./expression-I5NqfmRI.js";
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
