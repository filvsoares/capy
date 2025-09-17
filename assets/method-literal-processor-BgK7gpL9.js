import { M as MethodLiteral } from "./method-literal-zZT4y-pX.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./expression-gX919Tzj.js";
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
