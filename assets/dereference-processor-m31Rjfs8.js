import { d as dereference } from "./cg-dereference-Civ58NKr.js";
import { D as Dereference } from "./dereference-BMUsEu6t.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./extra-Dqv87a62.js";
import "./operation-ClDvK6AF.js";
import "./expression-gX919Tzj.js";
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
