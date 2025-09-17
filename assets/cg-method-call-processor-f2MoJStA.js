import { M as MethodCall } from "./method-call-IOoUtt-P.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./operation-CGef310c.js";
import "./expression-BI_7gns1.js";
class MethodCallProcessor extends Bean {
  constructor(expressionProcessor) {
    super();
    this.expressionProcessor = expressionProcessor;
  }
  processExpression(c, obj) {
    if (!(obj instanceof MethodCall)) {
      return;
    }
    const result = ["await ", ...this.expressionProcessor.processExpression(c, obj.operand), "("];
    for (let i = 0; i < obj.argList.length; i++) {
      if (i > 0) {
        result.push(", ");
      }
      result.push(...this.expressionProcessor.processExpression(c, obj.argList[i]));
    }
    result.push(")");
    return result;
  }
}
export {
  MethodCallProcessor
};
