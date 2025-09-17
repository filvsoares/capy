import { m as methodData } from "./cg-method-data-D1Uf3f84.js";
import { L as LocalVariableReference } from "./local-variable-reference-D6yAfqLR.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./extra-Dqv87a62.js";
import "./expression-I5NqfmRI.js";
class LocalVariableReferenceProcessor extends Bean {
  processExpression(c, obj) {
    if (!(obj instanceof LocalVariableReference)) {
      return;
    }
    const _methodData = methodData.optionalFrom(c);
    if (!_methodData) {
      return;
    }
    return [_methodData.getJsName(obj)];
  }
}
export {
  LocalVariableReferenceProcessor
};
