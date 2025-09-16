import { combinePos, INVALID } from '@/base';
import { ExpressionReader, ExpressionReaderContext } from '@/modules/expression/expression-reader';
import { Assignment } from '@/modules/operation/assignment';
import { Operator } from '@/modules/tokenizer/operator';
import { TypeReader } from '@/modules/type/type-reader';
import { Bean } from '@/util/beans';
import { OperationProcessor, ProcessResult, ProcessToken } from '../expression/operation-processor';

export class AssignmentProcessor extends Bean implements OperationProcessor {
  pass = 4;

  constructor(private expressionReader: ExpressionReader, private typeReader: TypeReader) {
    super();
  }

  process(c: ExpressionReaderContext, t1: ProcessToken, t2?: ProcessToken, t3?: ProcessToken): ProcessResult {
    if (this.expressionReader.isOperand(t1) && Operator.matches(t2, '=') && this.expressionReader.isOperand(t3)) {
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
