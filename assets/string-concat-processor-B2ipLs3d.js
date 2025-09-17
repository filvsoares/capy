import { S as StringConcat } from "./string-concat-Bztvo2Rl.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./operation-Ow9MKkNb.js";
import "./expression-I5NqfmRI.js";
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
