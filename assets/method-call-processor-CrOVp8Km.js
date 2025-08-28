import { C as CallableType } from "./callable-type-DoqtKxk0.js";
import { B as Bean, b as INVALID, E as ERROR, M as MethodCall, c as combinePos } from "./index-s97_hl8g.js";
import { B as Bracket } from "./bracket-CL1IELux.js";
import "./token-YsknnliN.js";
class MethodCallProcessor extends Bean {
  constructor(expressionReader, typeReader) {
    super();
    this.expressionReader = expressionReader;
    this.typeReader = typeReader;
    this.pass = 0;
    this.priority = 100;
  }
  process(c, context, t1, t2, t3) {
    if (this.expressionReader.isOperand(t1) && Bracket.matches(t2, "(")) {
      const operand = this.expressionReader.resolveOperand(c, t1, context, true);
      if (operand === INVALID) {
        return INVALID;
      }
      if (!(operand.type instanceof CallableType)) {
        c.addError({
          level: ERROR,
          message: `${operand.type} is not callable`,
          pos: operand.pos
        });
        return INVALID;
      }
      const c1 = c.derive(t2.tokenList);
      const argList = this.expressionReader.readList(c1, context, {
        unexpectedTokenErrorMsg: (t) => `Expected "," or ")" but found ${t}`
      });
      if (operand.type.argList.length !== argList.length) {
        c.addError({
          level: ERROR,
          message: `Method expects ${operand.type.argList.length} argument(s) but ${argList.length} was/were provided`,
          pos: t2.pos
        });
        return INVALID;
      }
      for (let i = 0; i < argList.length; i++) {
        if (!this.typeReader.isAssignable(argList[i].type, operand.type.argList[i].type)) {
          c.addError({
            level: ERROR,
            message: `Argument ${i + 1} expects type ${operand.type.argList[i].type} but ${argList[i].type} was provided`,
            pos: argList[i].pos
          });
          return INVALID;
        }
      }
      return { result: new MethodCall(operand, argList, operand.type.returnType, combinePos(t1.pos, t2.pos)), skip: 1 };
    }
  }
}
export {
  MethodCallProcessor
};
