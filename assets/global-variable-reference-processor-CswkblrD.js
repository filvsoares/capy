import { d as dereference } from "./cg-dereference-Civ58NKr.js";
import { G as GlobalVariableReference } from "./global-variable-reference-DDCmF-Z4.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./extra-Dqv87a62.js";
import "./expression-gX919Tzj.js";
class GlobalVariableReferenceProcessor extends Bean {
  processExpression(c, obj) {
    if (!(obj instanceof GlobalVariableReference)) {
      return;
    }
    if (dereference.optionalFrom(c)) {
      return [`${c.codegenData.getSymbolJsName(obj.module, obj.name)}get()`];
    }
    return [c.codegenData.getSymbolJsName(obj.module, obj.name)];
  }
}
export {
  GlobalVariableReferenceProcessor
};
