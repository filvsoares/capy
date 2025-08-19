import { Bean } from '@/util/beans';
import { L2OperationProcessor } from '../l2-expression/l2-operation-processor';
import { L2Expression, L2OperationStep } from '../l2-expression/l2-expression';
import { Invalid, INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L1Bracket } from '../l1-reader/l1-bracket';
import { L2MethodCall } from './l2-method-call';
import { combinePos, ERROR } from '../base';
import { L1Base } from '../l1-parser/l1-types';
import { L2ArraySubscript } from './l2-array-subscript';
import { L2ExpressionReader } from '../l2-expression/l2-expression-reader';

export class L2ArraySubscriptProcessor extends Bean implements L2OperationProcessor {
  pass = 0;

  expressionReader: L2ExpressionReader;

  constructor([expressionReaders]: [L2ExpressionReader]) {
    super();
    this.expressionReader = expressionReaders;
  }

  process(
    c: L2ParseContext,
    t1: L2Expression | L1Base,
    t2?: L2Expression | L1Base
  ): { step: L2OperationStep; skip: number } | Invalid | undefined {
    if (this.expressionReader!.isOperand(t1) && L1Bracket.matches(t2, '[')) {
      const c1 = new L2ParseContext(t2.tokenList);
      const r = this.expressionReader!.readList(c1, {
        unexpectedTokenErrorMsg: (t) => `Expected "]" but found ${t}`,
      });
      c.errors.push(...c1.errors);
      if (r.length === 0) {
        c.errors.push({
          level: ERROR,
          message: `Expected expression`,
          pos: t2.pos,
        });
        return INVALID;
      }
      if (r.length > 1) {
        c.errors.push({
          level: ERROR,
          message: `Expected ")"`,
          pos: r[1].pos,
        });
        return INVALID;
      }
      return { step: new L2ArraySubscript(r[0], combinePos(t1.pos, t2.pos)), skip: 1 };
    }
  }
}
