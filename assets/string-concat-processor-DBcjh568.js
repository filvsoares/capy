import { S as StringConcat } from "./string-concat-D_mh4wUB.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./operation-DtccBRam.js";
import "./expression-DdT-ttwU.js";
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
