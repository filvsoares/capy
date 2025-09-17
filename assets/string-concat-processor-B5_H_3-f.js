import { S as StringConcat } from "./string-concat-BbVCTsjP.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./operation-ClDvK6AF.js";
import "./expression-gX919Tzj.js";
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
