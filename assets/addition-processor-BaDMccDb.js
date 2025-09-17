import { B as Bean, I as INVALID, b as combinePos } from "./index-DyTq3Mxn.js";
import { S as StringConcat } from "./string-concat-BJdp4c9M.js";
import { a as isStringType, S as STRING } from "./simple-type-DZbjR7se.js";
import { O as Operator } from "./operator-D6f5KmIA.js";
import "./operation-CGef310c.js";
import "./expression-BI_7gns1.js";
import "./type-Cw01Jon0.js";
import "./token-ofOFEBrc.js";
class AdditionProcessor extends Bean {
  constructor(expressionReader) {
    super();
    this.expressionReader = expressionReader;
    this.pass = 3;
  }
  process(c, t1, t2, t3) {
    if (this.expressionReader.isOperand(t1) && Operator.matches(t2, "+") && this.expressionReader.isOperand(t3)) {
      const o1 = this.expressionReader.resolveOperand(c, t1, true);
      if (o1 === INVALID) {
        return INVALID;
      }
      const o2 = this.expressionReader.resolveOperand(c, t3, true);
      if (o2 === INVALID) {
        return INVALID;
      }
      if (isStringType(o1.type) && isStringType(o2.type)) {
        return { result: new StringConcat(o1, o2, STRING, combinePos(o1.pos, o2.pos)), skip: 2 };
      }
      c.parseErrors.addError(`Cannot add/concatenate ${o1.type} with ${o2.type}`, combinePos(o1.pos, o2.pos));
      return INVALID;
    }
  }
}
export {
  AdditionProcessor
};
