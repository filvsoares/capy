import { Bean } from '@/util/beans';
import { combinePos } from '../../base';
import { L1Bracket } from '../l1-reader/l1-bracket';
import { L2ExpressionReader } from '../l2-expression/l2-expression-reader';
import { L2OperationProcessor, ProcessResult, ProcessToken } from '../l2-expression/l2-operation-processor';
import { L2ParseContext } from '../l2-parser/l2-types';
import { L2MethodCall } from './l2-method-call';

export class L2MethodCallProcessor extends Bean implements L2OperationProcessor {
  pass = 0;
  priority = 100;

  constructor(private expressionReader: L2ExpressionReader) {
    super();
  }

  process(c: L2ParseContext, t1: ProcessToken, t2?: ProcessToken, t3?: ProcessToken): ProcessResult {
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
