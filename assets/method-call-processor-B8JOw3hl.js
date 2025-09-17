import { B as Bean, I as INVALID, b as combinePos } from "./index-DyTq3Mxn.js";
import { C as CallableType } from "./callable-type-DOuZ7DUR.js";
import { M as MethodCall } from "./method-call-IOoUtt-P.js";
import { T as TokenReader } from "./token-reader-CWKbD-VP.js";
import { B as Bracket } from "./bracket-CzgbCMwV.js";
import "./type-Cw01Jon0.js";
import "./operation-CGef310c.js";
import "./expression-BI_7gns1.js";
import "./token-ofOFEBrc.js";
class MethodCallProcessor extends Bean {
  constructor(expressionReader, typeReader) {
    super();
    this.expressionReader = expressionReader;
    this.typeReader = typeReader;
    this.pass = 0;
    this.priority = 100;
  }
  process(c, t1, t2, t3) {
    if (this.expressionReader.isOperand(t1) && Bracket.matches(t2, "(")) {
      const operand = this.expressionReader.resolveOperand(c, t1, true);
      if (operand === INVALID) {
        return INVALID;
      }
      if (!(operand.type instanceof CallableType)) {
        c.parseErrors.addError(`${operand.type} is not callable`, operand.pos);
        return INVALID;
      }
      const argList = this.expressionReader.readList(
        { ...c, tokenReader: new TokenReader(t2.tokenList) },
        { unexpectedTokenErrorMsg: (t) => `Expected "," or ")" but found ${t}` }
      );
      if (operand.type.argList.length !== argList.length) {
        c.parseErrors.addError(
          `Method expects ${operand.type.argList.length} argument(s) but ${argList.length} was/were provided`,
          t2.pos
        );
        return INVALID;
      }
      for (let i = 0; i < argList.length; i++) {
        if (!this.typeReader.isAssignable(argList[i].type, operand.type.argList[i].type)) {
          c.parseErrors.addError(
            `Argument ${i + 1} expects type ${operand.type.argList[i].type} but ${argList[i].type} was provided`,
            argList[i].pos
          );
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
