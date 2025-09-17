import { M as MethodCall } from "./method-call-BWqwrHQi.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./operation-ClDvK6AF.js";
import "./expression-gX919Tzj.js";
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
