import { B as Bean, b as INVALID, E as ERROR, l as Assignment, c as combinePos } from "./index-s97_hl8g.js";
import { O as Operator } from "./operator-BG3tGXnj.js";
import "./token-YsknnliN.js";
class AssignmentProcessor extends Bean {
  constructor(expressionReader, typeReader) {
    super();
    this.expressionReader = expressionReader;
    this.typeReader = typeReader;
    this.pass = 4;
  }
  process(c, context, t1, t2, t3) {
    if (this.expressionReader.isOperand(t1) && Operator.matches(t2, "=") && this.expressionReader.isOperand(t3)) {
      const operand = this.expressionReader.resolveOperand(c, t1, context, true);
      if (operand === INVALID) {
        return INVALID;
      }
      const target = this.expressionReader.resolveOperand(c, t3, context, false);
      if (target === INVALID) {
        return INVALID;
      }
      if (!target.isReference) {
        c.addError({
          level: ERROR,
          message: `Cannot assign value to ${target}`,
          pos: target.pos
        });
        return INVALID;
      }
      if (!this.typeReader.isAssignable(operand.type, target.type)) {
        c.addError({
          level: ERROR,
          message: `Value of type ${operand.type} cannot be assigned to variable of type ${target.type}`,
          pos: target.pos
        });
        return INVALID;
      }
      return { result: new Assignment(operand, target, operand.type, combinePos(target.pos, operand.pos)), skip: 2 };
    }
  }
}
export {
  AssignmentProcessor
};
