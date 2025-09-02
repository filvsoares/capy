import { d as dereference } from "./dereference-Dg4sNnGm.js";
import { D as Dereference } from "./dereference-B5apI-FG.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./operation-DtccBRam.js";
import "./expression-DdT-ttwU.js";
class DereferenceProcessor extends Bean {
  constructor(expressionProcessor) {
    super();
    this.expressionProcessor = expressionProcessor;
  }
  processExpression(c, obj) {
    if (!(obj instanceof Dereference)) {
      return;
    }
    return [...this.expressionProcessor.processExpression(c.with(dereference()), obj.operand)];
  }
}
export {
  DereferenceProcessor
};
