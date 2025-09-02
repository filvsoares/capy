import { E as ExpressionStatement } from "./expression-statement-DaAWbzNd.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./statement-BEQNu2Pd.js";
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
