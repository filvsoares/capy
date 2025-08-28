import { ExpressionContext, ExpressionReader } from '@/modules/parser/expression/expression-reader';
import { CallableType } from '@/modules/parser/method/callable-type';
import { MethodCall } from '@/modules/parser/method/method-call';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Bracket } from '@/modules/parser/tokenizer/bracket';
import { TypeReader } from '@/modules/parser/type/type-reader';
import { Bean } from '@/util/beans';
import { combinePos, ERROR, INVALID } from '../../../base';
import { OperationProcessor, ProcessResult, ProcessToken } from '../expression/operation-processor';

export class MethodCallProcessor extends Bean implements OperationProcessor {
  pass = 0;
  priority = 100;

  constructor(private expressionReader: ExpressionReader, private typeReader: TypeReader) {
    super();
  }

  process(
    c: ParserContext,
    context: ExpressionContext | null,
    t1: ProcessToken,
    t2?: ProcessToken,
    t3?: ProcessToken
  ): ProcessResult {
    if (this.expressionReader.isOperand(t1) && Bracket.matches(t2, '(')) {
      const operand = this.expressionReader.resolveOperand(c, t1, context, true);
      if (operand === INVALID) {
        return INVALID;
      }
      if (!(operand.type instanceof CallableType)) {
        c.addError({
          level: ERROR,
          message: `${operand.type} is not callable`,
          pos: operand.pos,
        });
        return INVALID;
      }
      const c1 = c.derive(t2.tokenList);
      const argList = this.expressionReader.readList(c1, context, {
        unexpectedTokenErrorMsg: (t) => `Expected "," or ")" but found ${t}`,
      });

      if (operand.type.argList.length !== argList.length) {
        c.addError({
          level: ERROR,
          message: `Method expects ${operand.type.argList.length} argument(s) but ${argList.length} was/were provided`,
          pos: t2.pos,
        });
        return INVALID;
      }
      for (let i = 0; i < argList.length; i++) {
        if (!this.typeReader.isAssignable(argList[i].type, operand.type.argList[i].type)) {
          c.addError({
            level: ERROR,
            message: `Argument ${i + 1} expects type ${operand.type.argList[i].type} but ${
              argList[i].type
            } was provided`,
            pos: argList[i].pos,
          });
          return INVALID;
        }
      }
      return { result: new MethodCall(operand, argList, operand.type.returnType, combinePos(t1.pos, t2.pos)), skip: 1 };
    }
  }
}
