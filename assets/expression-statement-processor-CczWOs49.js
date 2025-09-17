import { E as ExpressionStatement } from "./expression-statement-DV-fZMAI.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./statement-D1Z7utbn.js";
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
