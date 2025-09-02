function methodData(stack) {
  return {
    methodData: {
      getJsName(obj) {
        return stack[obj.index].jsName;
      }
    }
  };
}
function hasMethodData(c) {
  return c.methodData !== void 0;
}
export {
  hasMethodData as h,
  methodData as m
};
