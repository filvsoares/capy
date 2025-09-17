import { d as declareExtraKey } from "./extra-Dqv87a62.js";
const methodData = declareExtraKey("methodData");
class MethodData {
  constructor(stack) {
    this.stack = stack;
  }
  getJsName(obj) {
    return this.stack[obj.index].jsName;
  }
}
export {
  MethodData as M,
  methodData as m
};
