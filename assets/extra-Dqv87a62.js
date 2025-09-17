function declareExtraKey(name) {
  const key = Symbol(name);
  return {
    key,
    wrap(value) {
      return { [key]: value };
    },
    addTo(obj, value) {
      obj[key] = value;
    },
    requireFrom(obj) {
      const result = obj[key];
      if (result === void 0) {
        throw new Error(`Object does not have required extra '${key.description}'`);
      }
      return result;
    },
    optionalFrom(obj) {
      return obj[key];
    }
  };
}
export {
  declareExtraKey as d
};
