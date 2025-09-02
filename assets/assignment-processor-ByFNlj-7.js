import { A as Assignment } from "./assignment-eya3ith5.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./operation-DtccBRam.js";
import "./expression-DdT-ttwU.js";
class AssignmentProcessor extends Bean {
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
  AssignmentProcessor
};
