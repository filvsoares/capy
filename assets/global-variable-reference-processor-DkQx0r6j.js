import { h as hasDereference } from "./dereference-Dg4sNnGm.js";
import { G as GlobalVariableReference } from "./global-variable-reference-TbOEZYtv.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./expression-DdT-ttwU.js";
class GlobalVariableReferenceProcessor extends Bean {
  processExpression(c, obj) {
    if (!(obj instanceof GlobalVariableReference)) {
      return;
    }
    if (hasDereference(c)) {
      return [`${c.codegenData.getSymbolJsName(obj.module, obj.name)}get()`];
    }
    return [c.codegenData.getSymbolJsName(obj.module, obj.name)];
  }
}
export {
  GlobalVariableReferenceProcessor
};
