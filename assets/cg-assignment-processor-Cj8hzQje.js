import { A as Assignment } from "./assignment-CPCbZnEw.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./operation-CGef310c.js";
import "./expression-BI_7gns1.js";
class CgAssignmentProcessor extends Bean {
  constructor(expressionProcessor) {
    super();
    this.expressionProcessor = expressionProcessor;
  }
  processExpression(c, obj) {
    if (!(obj instanceof Assignment)) {
      return;
    }
    return [
      ...this.expressionProcessor.processExpression(c, obj.target),
      " = ",
      ...this.expressionProcessor.processExpression(c, obj.operand)
    ];
  }
}
export {
  CgAssignmentProcessor
};
