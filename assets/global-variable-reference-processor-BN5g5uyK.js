import { d as dereference } from "./cg-dereference-Civ58NKr.js";
import { G as GlobalVariableReference } from "./global-variable-reference-drp9uP7U.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./extra-Dqv87a62.js";
import "./expression-BI_7gns1.js";
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
