import { M as MethodLiteral } from "./method-literal-CsR4Jik3.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./expression-I5NqfmRI.js";
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
