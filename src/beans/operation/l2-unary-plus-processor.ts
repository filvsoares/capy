import { Bean } from '@/util/beans';
import { combinePos } from '../../base';
import { L2ExpressionReader } from '../expression/l2-expression-reader';
import { L2OperationProcessor, ProcessResult, ProcessToken } from '../expression/l2-operation-processor';
import { L1Operator } from '../l1-parser/l1-operator';
import { L2ParseContext } from '../l2-parser/l2-base';
import { L2UnaryPlus } from './l2-unary-plus';

export class L2UnaryPlusProcessor extends Bean implements L2OperationProcessor {
  pass = 1;

  constructor(private expressionReader: L2ExpressionReader) {
    super();
  }

  process(c: L2ParseContext, t1: ProcessToken, t2?: ProcessToken, t3?: ProcessToken): ProcessResult {
    if (this.expressionReader!.isOperand(t1) && L1Operator.matches(t2, '+') && !this.expressionReader!.isOperand(t3)) {
      return { step: new L2UnaryPlus(combinePos(t1.pos, t2.pos)), skip: 1 };
    }
  }
}
