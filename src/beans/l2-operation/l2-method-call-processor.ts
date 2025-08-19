import { Bean } from '@/util/beans';
import { L2OperationProcessor } from '../l2-expression/l2-operation-processor';
import { L2Expression, L2OperationStep } from '../l2-expression/l2-expression';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L1Bracket } from '../l1-reader/l1-bracket';
import { L2MethodCall } from './l2-method-call';
import { combinePos } from '../base';
import { L1Base } from '../l1-parser/l1-types';
import { L2ExpressionReader } from '../l2-expression/l2-expression-reader';

export class L2MethodCallProcessor extends Bean implements L2OperationProcessor {
  pass = 0;
  priority = 100;

  expressionReader: L2ExpressionReader;

  constructor([expressionReaders]: [L2ExpressionReader]) {
    super();
    this.expressionReader = expressionReaders;
  }

  process(
    c: L2ParseContext,
    t1: L2Expression | L1Base,
    t2?: L2Expression | L1Base
  ): { step: L2OperationStep; skip: number } | undefined {
    if (this.expressionReader!.isOperand(t1) && L1Bracket.matches(t2, '(')) {
      const c1 = new L2ParseContext(t2.tokenList);
      const r = this.expressionReader!.readList(c1, {
        unexpectedTokenErrorMsg: (t) => `Expected "," or ")" but found ${t}`,
      });
      c.errors.push(...c1.errors);
      return { step: new L2MethodCall(r, combinePos(t1.pos, t2.pos)), skip: 1 };
    }
  }
}
