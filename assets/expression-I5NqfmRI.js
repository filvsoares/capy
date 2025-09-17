import { h as Base } from "./index-3ZiCjh5_.js";
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
