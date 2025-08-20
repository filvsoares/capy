import { combinePos, ERROR, fallbackPos } from '@/base';
import { Bean } from '@/util/beans';
import { L1Separator } from '../l1-reader/l1-separator';
import { L2ExpressionReader } from '../l2-expression/l2-expression-reader';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2ExpressionStatement } from './l2-expression-statement';
import { L2StatementItemReader } from './l2-statement-item-reader';

export class L2ExpressionStatementReader extends Bean implements L2StatementItemReader {
  expressionReader: L2ExpressionReader;

  constructor([expressionReaders]: [L2ExpressionReader]) {
    super();
    this.expressionReader = expressionReaders;
  }

  read(c: L2ParseContext): ReadResult<L2ExpressionStatement> {
    const val = this.expressionReader!.read(c, {
      unexpectedTokenErrorMsg: (t) => `Expected ";" but found ${t}`,
    });
    if (val === INVALID) {
      return INVALID;
    }
    if (!val) {
      return;
    }

    const t = c.current;
    if (L1Separator.matches(t, ';')) {
      c.consume();
    } else {
      c.errors.push({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t?.pos, val.pos),
      });
    }

    return new L2ExpressionStatement(val, combinePos(val.pos, (t ?? val).pos));
  }
}
