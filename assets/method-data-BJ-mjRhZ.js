function methodData(parent, returnType) {
  return { methodData: new MethodDataImpl(null, returnType) };
}
function hasMethodData(c) {
  return c.methodData !== void 0;
}
class MethodDataImpl {
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
  find(ref) {
    let current = this;
    while (current) {
      const result = this.itemsByName[ref.name];
      if (result !== void 0) {
        return result;
      }
      current = current.parent;
    }
  }
  createChild() {
    return new MethodDataImpl(this, this.returnType);
  }
}
export {
  hasMethodData as h,
  methodData as m
};
