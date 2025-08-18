import { Bean } from '@/util/beans';
import { INVALID, L2ParseContext, ReadResult } from '../../l2-types';
import { L2StatementItemReader } from './_bean-interfaces';
import { L2ExpressionStatement } from './l2-expression-statement';
import { readExpression } from '../l2-expression';
import { L1Separator } from '@/parser/layer1/reader/l1-separator';
import { combinePos, ERROR, fallbackPos } from '@/parser/base';

export class L2ExpressionStatementReader extends Bean implements L2StatementItemReader {
  read(c: L2ParseContext): ReadResult<L2ExpressionStatement> {
    const val = readExpression(c, {
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
