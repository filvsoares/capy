import { h as hasMethodData } from "./method-data-CGRmJbpc.js";
import { L as LocalVariableReference } from "./local-variable-reference-CbLeQCuI.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./expression-DdT-ttwU.js";
class LocalVariableReferenceProcessor extends Bean {
  processExpression(c, obj) {
    if (!(obj instanceof LocalVariableReference) || !hasMethodData(c)) {
      return;
    }
    return [c.methodData.getJsName(obj)];
  }
}
export {
  LocalVariableReferenceProcessor
};
