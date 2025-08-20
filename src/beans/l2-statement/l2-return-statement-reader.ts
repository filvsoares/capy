import { Bean } from '@/util/beans';

import { combinePos, ERROR, fallbackPos } from '@/base';
import { L1Separator } from '../l1-reader/l1-separator';
import { L1Keyword } from '../l1-reader/l1-word';
import { L2ExpressionReader } from '../l2-expression/l2-expression-reader';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2ReturnStatement } from './l2-return-statement';
import { L2StatementItemReader } from './l2-statement-item-reader';

export class L2ReturnStatementReader extends Bean implements L2StatementItemReader {
  priority = 100;

  expressionReader: L2ExpressionReader;

  constructor([expressionReader]: [L2ExpressionReader]) {
    super();
    this.expressionReader = expressionReader;
  }

  read(c: L2ParseContext): ReadResult<L2ReturnStatement> {
    const t1 = c.current;
    if (!L1Keyword.matches(t1, 'return')) {
      return;
    }
    c.consume();

    const t2 = c.current;
    if (L1Separator.matches(t2, ';')) {
      c.consume();
      return new L2ReturnStatement(null, combinePos(t1.pos, t2.pos));
    }

    const val = this.expressionReader.read(c, {
      unexpectedTokenErrorMsg: (t) => `Expected expression but found ${t}`,
    });
    if (val === INVALID) {
      return INVALID;
    }
    if (!val) {
      c.errors.push({
        level: ERROR,
        message: `Expected expression but found ${t2}`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }

    const t3 = c.current;
    if (L1Separator.matches(t3, ';')) {
      c.consume();
    } else {
      c.errors.push({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t3?.pos, val.pos),
      });
    }

    return new L2ReturnStatement(val, combinePos(t1.pos, (t3 ?? val).pos));
  }
}
