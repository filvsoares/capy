import { Bean, BeanList } from '@/util/beans';
import { L2ExpressionReader, L2OperationPass1Processor } from '../l2-expression/_bean-interfaces';
import { L2Expression, L2OperationStep } from '../l2-expression/l2-expression-reader';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L1Bracket } from '../l1-reader/l1-bracket';
import { L2MethodCall } from './l2-method-call';
import { combinePos } from '../base';
import { L1Base } from '../l1-parser/l1-types';

export class L2MethodCallProcessor extends Bean implements L2OperationPass1Processor {
  _priority = 100;
  expressionReader?: L2ExpressionReader;

  constructor([expressionReaders]: [BeanList<L2ExpressionReader>]) {
    super();
    expressionReaders.onLoad((val) => (this.expressionReader = val[0]));
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
