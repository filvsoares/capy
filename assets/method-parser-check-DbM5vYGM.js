import { M as Method } from "./method-DxMFOSUf.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./symbol-CzSKJU1d.js";
class MethodParserCheck extends Bean {
  onCheckOutputs(c) {
    const startMethod = c.parserData.findSymbol("main", "start");
    if (!(startMethod instanceof Method)) {
      c.parseErrors.addError(`Main module must contain a method named "start"`);
    }
  }
}
export {
  MethodParserCheck
};
