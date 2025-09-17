import { S as StringConcat } from "./string-concat-BJdp4c9M.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./operation-CGef310c.js";
import "./expression-BI_7gns1.js";
class StringConcatProcessor extends Bean {
  constructor(expressionProcessor) {
    super();
    this.expressionProcessor = expressionProcessor;
  }
  processExpression(c, obj) {
    if (!(obj instanceof StringConcat)) {
      return;
    }
    return [
      ...this.expressionProcessor.processExpression(c, obj.operand),
      " + ",
      ...this.expressionProcessor.processExpression(c, obj.other)
    ];
  }
}
export {
  StringConcatProcessor
};
