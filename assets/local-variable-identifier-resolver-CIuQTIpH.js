import { L as LocalVariableReference } from "./local-variable-reference-CbLeQCuI.js";
import { h as hasMethodData } from "./method-data-BJ-mjRhZ.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./expression-DdT-ttwU.js";
class LocalVariableIdentifierResolver extends Bean {
  constructor(parser) {
    super();
    this.parser = parser;
    this.priority = 1e3;
  }
  resolveIdentifier(c, obj) {
    if (!hasMethodData(c)) {
      return;
    }
    const index = c.methodData.find(obj);
    if (index !== void 0) {
      const dep = c.methodData.items[index];
      return new LocalVariableReference(index, dep.name, dep.type, obj.pos);
    }
  }
}
export {
  LocalVariableIdentifierResolver
};
