import { M as MethodLiteral } from "./method-literal-C8E8mbKA.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./expression-DdT-ttwU.js";
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
