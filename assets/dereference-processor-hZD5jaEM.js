import { d as dereference } from "./cg-dereference-Civ58NKr.js";
import { D as Dereference } from "./dereference-CBCVONbW.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./extra-Dqv87a62.js";
import "./operation-Ow9MKkNb.js";
import "./expression-I5NqfmRI.js";
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
