import { M as Method } from "./method-DkaTFuoM.js";
class NativeMethod extends Method {
  constructor(module, name, type, pos) {
    super(module, name, type, pos);
  }
  toString() {
    return "native method";
  }
}
export {
  NativeMethod as N
};
