import { combinePos, ERROR, INVALID } from '@/base';
import { ExpressionContext, ExpressionReader } from '@/beans/expression/expression-reader';
import { Assignment } from '@/beans/operation/assignment';
import { ParserContext } from '@/beans/parser/parser-context';
import { Operator } from '@/beans/tokenizer/operator';
import { TypeReader } from '@/beans/type/type-reader';
import { Bean } from '@/util/beans';
import { OperationProcessor, ProcessResult, ProcessToken } from '../expression/operation-processor';

export class AssignmentProcessor extends Bean implements OperationProcessor {
  pass = 4;

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
    if (this.expressionReader.isOperand(t1) && Operator.matches(t2, '=') && this.expressionReader.isOperand(t3)) {
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
          pos: target.pos,
        });
        return INVALID;
      }
      if (!this.typeReader.isAssignable(operand.type, target.type)) {
        c.addError({
          level: ERROR,
          message: `Value of type ${operand.type} cannot be assigned to variable of type ${target.type}`,
          pos: target.pos,
        });
        return INVALID;
      }
      return { result: new Assignment(operand, target, operand.type, combinePos(target.pos, operand.pos)), skip: 2 };
    }
  }
}
