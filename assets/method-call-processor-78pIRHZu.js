import { M as MethodCall } from "./method-call-Dk84_5LW.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./operation-DtccBRam.js";
import "./expression-DdT-ttwU.js";
class MethodCallProcessor extends Bean {
  constructor(expressionProcessor) {
    super();
    this.expressionProcessor = expressionProcessor;
  }
  processExpression(c, obj) {
    if (!(obj instanceof MethodCall)) {
      return;
    }
    const result = [...this.expressionProcessor.processExpression(c, obj.operand), "("];
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
