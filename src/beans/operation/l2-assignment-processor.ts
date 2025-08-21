import { Bean } from '@/util/beans';
import { combinePos } from '../../base';
import { L2ExpressionReader } from '../expression/l2-expression-reader';
import { L2OperationProcessor, ProcessResult, ProcessToken } from '../expression/l2-operation-processor';
import { L1Operator } from '../l1-parser/l1-operator';
import { INVALID, L2ParseContext } from '../l2-parser/l2-base';
import { L2Assignment } from './l2-assignment';

export class L2AssignmentProcessor extends Bean implements L2OperationProcessor {
  pass = 4;

  constructor(private expressionReader: L2ExpressionReader) {
    super();
  }

  process(c: L2ParseContext, t1: ProcessToken, t2?: ProcessToken, t3?: ProcessToken): ProcessResult {
    if (this.expressionReader.isOperand(t1) && L1Operator.matches(t2, '=') && this.expressionReader.isOperand(t3)) {
      const operand = this.expressionReader.unwrapOperand(c, t3);
      if (operand === INVALID) {
        return INVALID;
      }
      return { step: new L2Assignment(operand, combinePos(t1.pos, t3.pos)), skip: 2 };
    }
  }
}
