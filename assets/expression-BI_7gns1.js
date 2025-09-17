import { h as Base } from "./index-DyTq3Mxn.js";
class Expression extends Base {
  constructor(type, pos) {
    super(pos);
    this.type = type;
  }
  get isReference() {
    return false;
  }
}
export {
  Expression as E
};
