import { R as ReturnStatement } from "./return-statement-DSXc-g5D.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./statement-BEQNu2Pd.js";
class ReturnStatementProcessor extends Bean {
  constructor(expressionProcessor) {
    super();
    this.expressionProcessor = expressionProcessor;
  }
  processStatement(c, obj, indent) {
    if (!(obj instanceof ReturnStatement)) {
      return;
    }
    c.codegenWriter.write(indent, "return");
    if (obj.expr) {
      c.codegenWriter.write(" ", ...this.expressionProcessor.processExpression(c, obj.expr));
    }
    c.codegenWriter.write(";\n");
    return true;
  }
}
export {
  ReturnStatementProcessor
};
