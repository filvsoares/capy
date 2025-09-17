import { A as Assignment } from "./assignment-CN3cZpvq.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./operation-ClDvK6AF.js";
import "./expression-gX919Tzj.js";
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
