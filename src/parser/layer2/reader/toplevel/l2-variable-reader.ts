import { combinePos, ERROR, fallbackPos, Pos } from '@/parser/base';
import { L1Operator } from '@/parser/layer1/reader/l1-operator';
import { L1Separator } from '@/parser/layer1/reader/l1-separator';
import { L1Identifier, L1Keyword } from '@/parser/layer1/reader/l1-word';
import { Bean } from '@/util/beans';
import { L2ToplevelItemReader } from './_bean-interfaces';
import { INVALID, L2ParseContext, ReadResult } from '../../l2-types';
import { L2Variable } from './l2-variable';
import { L2Expression, readExpression } from '../l2-expression';
import { readType } from '../l2-type-all';

export class L2VariableReader extends Bean implements L2ToplevelItemReader {
  read(c: L2ParseContext): ReadResult<L2Variable> {
    const t1 = c.current;
    if (!L1Keyword.matches(t1, 'var')) {
      return;
    }
    c.consume();

    const t2 = c.current;
    if (!L1Identifier.matches(t2)) {
      c.errors.push({
        level: ERROR,
        message: `Expected string`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    c.consume();

    let t3 = c.current;
    if (!L1Operator.matches(t3, ':')) {
      c.errors.push({
        level: ERROR,
        message: `Expected ":"`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
      return INVALID;
    }
    c.consume();

    const t4 = c.current;
    const type = t4 && readType(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.errors.push({
        level: ERROR,
        message: `Expected type`,
        pos: fallbackPos(t4?.pos, t3.pos),
      });
      return INVALID;
    }

    t3 = c.current;
    let initExpr: L2Expression | null = null;
    if (L1Operator.matches(t3, '=')) {
      c.consume();

      const t4 = c.current;
      const _initExpr = t4 && readExpression(c);
      if (_initExpr === INVALID) {
        return INVALID;
      }
      if (!_initExpr) {
        c.errors.push({
          level: ERROR,
          message: `Expected initializer`,
          pos: fallbackPos(t4?.pos, t3.pos),
        });
        return INVALID;
      }
      initExpr = _initExpr;
    }

    const t5 = c.current;
    if (L1Separator.matches(t5, ';')) {
      c.consume();
    } else {
      c.errors.push({
        level: ERROR,
        message: type === initExpr ? `Expected ";"` : `Expected "=" or ";"`,
        pos: fallbackPos(t5?.pos, t3!.pos),
      });
    }

    return new L2Variable(t2.name, type, initExpr, combinePos(t1.pos, (t5 ?? t2).pos));
  }
}
