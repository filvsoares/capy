import { A as Assignment } from "./assignment-sxxYQsme.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./operation-Ow9MKkNb.js";
import "./expression-I5NqfmRI.js";
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
