import { R as ReturnStatement } from "./return-statement-DA0w9-qL.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./statement-1pRbB8Zx.js";
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
