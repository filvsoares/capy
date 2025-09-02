import { B as Bean, I as INVALID, g as combinePos } from "./index-BncJlCxS.js";
import { A as Assignment } from "./assignment-eya3ith5.js";
import { O as Operator } from "./operator-CJR6HJ2X.js";
import "./operation-DtccBRam.js";
import "./expression-DdT-ttwU.js";
import "./token-YbVOofIc.js";
class AssignmentProcessor extends Bean {
  constructor(expressionReader, typeReader) {
    super();
    this.expressionReader = expressionReader;
    this.typeReader = typeReader;
    this.pass = 4;
  }
  process(c, t1, t2, t3) {
    if (this.expressionReader.isOperand(t1) && Operator.matches(t2, "=") && this.expressionReader.isOperand(t3)) {
      const operand = this.expressionReader.resolveOperand(c, t1, true);
      if (operand === INVALID) {
        return INVALID;
      }
      const target = this.expressionReader.resolveOperand(c, t3, false);
      if (target === INVALID) {
        return INVALID;
      }
      if (!target.isReference) {
        c.parseErrors.addError(`Cannot assign value to ${target}`, target.pos);
        return INVALID;
      }
      if (!this.typeReader.isAssignable(operand.type, target.type)) {
        c.parseErrors.addError(
          `Value of type ${operand.type} cannot be assigned to variable of type ${target.type}`,
          target.pos
        );
        return INVALID;
      }
      return { result: new Assignment(operand, target, operand.type, combinePos(target.pos, operand.pos)), skip: 2 };
    }
  }
}
export {
  AssignmentProcessor
};
