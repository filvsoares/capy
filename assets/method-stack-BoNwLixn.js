class MethodStack {
  constructor(parent = null, returnType) {
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
    return new MethodStack(this, this.returnType);
  }
}
export {
  MethodStack as M
};
