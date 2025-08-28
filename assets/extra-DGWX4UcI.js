function declareExtraKey() {
  return { key: Symbol() };
}
class ExtraHandler {
  constructor() {
    this.extras = {};
  }
  put(key, value) {
    this.extras[key.key] = value;
  }
  get(key) {
    return this.extras[key.key];
  }
  getOrCreate(key, factory) {
    let val = this.extras[key.key];
    if (val === void 0) {
      this.extras[key.key] = val = factory();
    }
    return val;
  }
}
export {
  ExtraHandler as E,
  declareExtraKey as d
};
