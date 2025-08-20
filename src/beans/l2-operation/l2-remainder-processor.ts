import { Bean } from '@/util/beans';
import { combinePos } from '../../base';
import { L1Operator } from '../l1-reader/l1-operator';
import { L2ExpressionReader } from '../l2-expression/l2-expression-reader';
import { L2OperationProcessor, ProcessResult, ProcessToken } from '../l2-expression/l2-operation-processor';
import { INVALID, L2ParseContext } from '../l2-parser/l2-types';
import { L2Remainder } from './l2-remainder';

export class L2RemainderProcessor extends Bean implements L2OperationProcessor {
  pass = 2;

  constructor(private expressionReader: L2ExpressionReader) {
    super();
  }

  process(c: L2ParseContext, t1: ProcessToken, t2?: ProcessToken, t3?: ProcessToken): ProcessResult {
    if (this.expressionReader.isOperand(t1) && L1Operator.matches(t2, '%') && this.expressionReader.isOperand(t3)) {
      const operand = this.expressionReader.unwrapOperand(c, t3);
      if (operand === INVALID) {
        return INVALID;
      }
      return { step: new L2Remainder(operand, combinePos(t1.pos, t3.pos)), skip: 2 };
    }
  }
}
