import { E as ExpressionStatement } from "./expression-statement-BS8iaRiv.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./statement-eXuGN2Ox.js";
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
