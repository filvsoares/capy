import { Bean } from '@/util/beans';
import { combinePos, ERROR } from '../../base';
import { L2ExpressionReader } from '../expression/l2-expression-reader';
import { L2OperationProcessor, ProcessResult, ProcessToken } from '../expression/l2-operation-processor';
import { L1Bracket } from '../l1-parser/l1-bracket';
import { INVALID, L2ParseContext } from '../l2-parser/l2-base';
import { L2ArraySubscript } from './l2-array-subscript';

export class L2ArraySubscriptProcessor extends Bean implements L2OperationProcessor {
  pass = 0;

  constructor(private expressionReader: L2ExpressionReader) {
    super();
  }

  process(c: L2ParseContext, t1: ProcessToken, t2?: ProcessToken, t3?: ProcessToken): ProcessResult {
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
