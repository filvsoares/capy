import { b as Base } from "./index-BncJlCxS.js";
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
