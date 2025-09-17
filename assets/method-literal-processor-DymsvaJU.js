import { M as MethodLiteral } from "./method-literal-P21cpdxF.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./expression-BI_7gns1.js";
class MethodLiteralProcessor extends Bean {
  processExpression(c, obj) {
    if (!(obj instanceof MethodLiteral)) {
      return;
    }
    return [c.codegenData.getSymbolJsName(obj.module, obj.name)];
  }
}
export {
  MethodLiteralProcessor
};
