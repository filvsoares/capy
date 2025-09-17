import { M as Method } from "./method-DkaTFuoM.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./symbol-CAVyxDMA.js";
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
