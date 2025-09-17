import { d as declareExtraKey } from "./extra-Dqv87a62.js";
const methodData = declareExtraKey("MethodData");
class MethodData {
  constructor(parent, returnType) {
    this.parent = parent;
    this.items = (parent == null ? void 0 : parent.items) ?? [];
    this.itemsByName = {};
    this.returnType = returnType;
  }
  add(item) {
    const existing = this.itemsByName[item.name];
    if (existing !== void 0) {
      return false;
    }
    const index = this.items.length;
    this.items.push(item);
    this.itemsByName[item.name] = index;
    return index;
  }
  find(name) {
    let current = this;
    while (current) {
      const result = this.itemsByName[name];
      if (result !== void 0) {
        return result;
      }
      current = current.parent;
    }
  }
  createChild() {
    return new MethodData(this, this.returnType);
  }
}
export {
  MethodData as M,
  methodData as m
};
