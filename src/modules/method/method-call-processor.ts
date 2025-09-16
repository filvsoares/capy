import { combinePos, INVALID } from '@/base';
import { ExpressionReader, ExpressionReaderContext } from '@/modules/expression/expression-reader';
import { CallableType } from '@/modules/method/callable-type';
import { MethodCall } from '@/modules/method/method-call';
import { TokenReader } from '@/modules/parser/token-reader';
import { Bracket } from '@/modules/tokenizer/bracket';
import { TypeReader } from '@/modules/type/type-reader';
import { Bean } from '@/util/beans';
import { OperationProcessor, ProcessResult, ProcessToken } from '../expression/operation-processor';

export class MethodCallProcessor extends Bean implements OperationProcessor {
  pass = 0;
  priority = 100;

  constructor(private expressionReader: ExpressionReader, private typeReader: TypeReader) {
    super();
  }

  process(c: ExpressionReaderContext, t1: ProcessToken, t2?: ProcessToken, t3?: ProcessToken): ProcessResult {
    if (this.expressionReader.isOperand(t1) && Bracket.matches(t2, '(')) {
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
