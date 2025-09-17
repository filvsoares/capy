import { M as Method } from "./method-7GHRjHkK.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./symbol-B09mnHSj.js";
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
