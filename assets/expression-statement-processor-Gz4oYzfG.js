import { E as ExpressionStatement } from "./expression-statement-s9BqjCE-.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./statement-1pRbB8Zx.js";
class ExpressionStatementProcessor extends Bean {
  constructor(expressionProcessor) {
    super();
    this.expressionProcessor = expressionProcessor;
  }
  processStatement(c, obj, indent) {
    if (!(obj instanceof ExpressionStatement)) {
      return;
    }
    c.codegenWriter.write(indent);
    c.codegenWriter.write(...this.expressionProcessor.processExpression(c, obj.expr));
    c.codegenWriter.write(";\n");
    return true;
  }
}
export {
  ExpressionStatementProcessor
};
