import { B as Bean, L as LocalVariableReference } from "./index-s97_hl8g.js";
import { M as MethodStack } from "./method-stack-BoNwLixn.js";
class LocalVariableIdentifierResolver extends Bean {
  constructor(parser) {
    super();
    this.parser = parser;
  }
  resolveIdentifier(c, obj, context) {
    if (!(context instanceof MethodStack)) {
      return;
    }
    const index = context.find(obj);
    if (index !== void 0) {
      const dep = context.items[index];
      return new LocalVariableReference(index, dep.name, dep.type, obj.pos);
    }
  }
}
export {
  LocalVariableIdentifierResolver
};
