import { Bean } from '@/util/beans';
import { L2OperationProcessor } from '../l2-expression/l2-operation-processor';
import { L2Expression, L2OperationStep } from '../l2-expression/l2-expression';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L1Bracket } from '../l1-reader/l1-bracket';
import { L2MethodCall } from './l2-method-call';
import { combinePos } from '../base';
import { L1Base } from '../l1-parser/l1-types';
import { L2ExpressionReader } from '../l2-expression/l2-expression-reader';
import { L1Operator } from '../l1-reader/l1-operator';
import { L2UnaryMinus } from './l2-unary-minus';

export class L2UnaryMinusProcessor extends Bean implements L2OperationProcessor {
  pass = 1;
  priority = 100;

  expressionReader: L2ExpressionReader;

  constructor([expressionReaders]: [L2ExpressionReader]) {
    super();
    this.expressionReader = expressionReaders;
  }

  process(
    c: L2ParseContext,
    t1: L2Expression | L1Base,
    t2?: L2Expression | L1Base,
    t3?: L2Expression | L1Base
  ): { step: L2OperationStep; skip: number } | undefined {
    if (this.expressionReader!.isOperand(t1) && L1Operator.matches(t2, '-') && !this.expressionReader!.isOperand(t3)) {
      return { step: new L2UnaryMinus(combinePos(t1.pos, t2.pos)), skip: 1 };
    }
  }
}
