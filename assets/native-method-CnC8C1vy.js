import { M as Method } from "./method-DxMFOSUf.js";
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
