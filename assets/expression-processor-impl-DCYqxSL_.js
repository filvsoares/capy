import { B as Bean } from "./index-DyTq3Mxn.js";
class ExpressionProcessorImpl extends Bean {
  constructor(expressionItemProcessors) {
    super();
    this.expressionItemProcessors = expressionItemProcessors;
  }
  processExpression(c, obj) {
    for (const processor of this.expressionItemProcessors) {
      const result = processor.processExpression(c, obj);
      if (result) {
        return result;
      }
    }
    throw new Error(`No expressionItemProcessor for ${obj.constructor.name}`);
  }
}
export {
  ExpressionProcessorImpl
};
