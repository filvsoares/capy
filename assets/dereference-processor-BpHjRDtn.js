import { d as dereference } from "./cg-dereference-Civ58NKr.js";
import { D as Dereference } from "./dereference-CZcnjHDC.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./extra-Dqv87a62.js";
import "./operation-CGef310c.js";
import "./expression-BI_7gns1.js";
class DereferenceProcessor extends Bean {
  constructor(expressionProcessor) {
    super();
    this.expressionProcessor = expressionProcessor;
  }
  processExpression(c, obj) {
    if (!(obj instanceof Dereference)) {
      return;
    }
    return [...this.expressionProcessor.processExpression({ ...c, ...dereference.wrap(true) }, obj.operand)];
  }
}
export {
  DereferenceProcessor
};
