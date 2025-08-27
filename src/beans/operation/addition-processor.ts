import { ExpressionContext, ExpressionReader } from '@/beans/expression/expression-reader';
import { StringConcat } from '@/beans/operation/string-concat';
import { ParserContext } from '@/beans/parser/parser-context';
import { isStringType, STRING } from '@/beans/type/simple-type';
import { Bean } from '@/util/beans';
import { combinePos, ERROR, INVALID } from '../../base';
import { OperationProcessor, ProcessResult, ProcessToken } from '../expression/operation-processor';
import { Operator } from '../tokenizer/operator';

export class AdditionProcessor extends Bean implements OperationProcessor {
  pass = 3;

  constructor(private expressionReader: ExpressionReader) {
    super();
  }

  process(
    c: ParserContext,
    context: ExpressionContext,
    t1: ProcessToken,
    t2?: ProcessToken,
    t3?: ProcessToken
  ): ProcessResult {
    if (this.expressionReader.isOperand(t1) && Operator.matches(t2, '+') && this.expressionReader.isOperand(t3)) {
      const o1 = this.expressionReader.unwrapOperand(c, t1, context);
      if (o1 === INVALID) {
        return INVALID;
      }
      const o2 = this.expressionReader.unwrapOperand(c, t3, context);
      if (o2 === INVALID) {
        return INVALID;
      }
      if (isStringType(o1.type) && isStringType(o2.type)) {
        return { result: new StringConcat(o1, o2, STRING, combinePos(o1.pos, o2.pos)), skip: 2 };
      }
      c.addError({
        level: ERROR,
        message: `Cannot add/concatenate ${o1.type} with ${o2.type}`,
        pos: combinePos(o1.pos, o2.pos),
      });
      return INVALID;
    }
  }
}
