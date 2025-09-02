import { M as Method } from "./method-vXMUZt8y.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./symbol-CzF83rwI.js";
class MethodParserCheck extends Bean {
  checkOutputs(c) {
    var _a;
    const startMethod = (_a = c.parserData.getOutput(c.parserData.mainModuleName)) == null ? void 0 : _a["start"];
    if (!(startMethod instanceof Method)) {
      c.parseErrors.addError(`Main module "${c.parserData.mainModuleName}" must contain a method named "start"`);
    }
  }
}
export {
  MethodParserCheck
};
