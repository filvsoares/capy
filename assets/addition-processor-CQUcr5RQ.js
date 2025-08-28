import { B as Bean, b as INVALID, m as isStringType, n as StringConcat, o as STRING, c as combinePos, E as ERROR } from "./index-s97_hl8g.js";
import { O as Operator } from "./operator-BG3tGXnj.js";
import "./token-YsknnliN.js";
class AdditionProcessor extends Bean {
  constructor(expressionReader) {
    super();
    this.expressionReader = expressionReader;
    this.pass = 3;
  }
  process(c, context, t1, t2, t3) {
    if (this.expressionReader.isOperand(t1) && Operator.matches(t2, "+") && this.expressionReader.isOperand(t3)) {
      const o1 = this.expressionReader.resolveOperand(c, t1, context, true);
      if (o1 === INVALID) {
        return INVALID;
      }
      const o2 = this.expressionReader.resolveOperand(c, t3, context, true);
      if (o2 === INVALID) {
        return INVALID;
      }
      if (isStringType(o1.type) && isStringType(o2.type)) {
        return { result: new StringConcat(o1, o2, STRING, combinePos(o1.pos, o2.pos)), skip: 2 };
      }
      c.addError({
        level: ERROR,
        message: `Cannot add/concatenate ${o1.type} with ${o2.type}`,
        pos: combinePos(o1.pos, o2.pos)
      });
      return INVALID;
    }
  }
}
export {
  AdditionProcessor
};
