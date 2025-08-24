import { combinePos, ERROR, fallbackPos } from '@/base';
import { Keyword } from '@/beans/parser/keyword';
import { Bean } from '@/util/beans';
import { L2ExpressionReader } from '../expression/expression-reader';
import { L2Expression } from '../expression/l2-expression';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L1Identifier } from '../parser/identifier';
import { Operator } from '../parser/operator';
import { Separator } from '../parser/separator';
import { L2ToplevelReader } from '../parser/toplevel-reader';
import { TypeReader } from '../type/type-reader';
import { L2Variable } from './l2-variable';

export class L2VariableReader extends Bean implements L2ToplevelReader {
  typeReader: TypeReader;
  expressionReader: L2ExpressionReader;

  constructor([typeReader, expressionReader]: [TypeReader, L2ExpressionReader]) {
    super();
    this.typeReader = typeReader;
    this.expressionReader = expressionReader;
  }

  read(c: L2ParseContext): ReadResult<L2Variable> {
    const t1 = c.current;
    if (!Keyword.matches(t1, 'var')) {
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
    if (!Operator.matches(t3, ':')) {
      c.errors.push({
        level: ERROR,
        message: `Expected ":"`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
      return INVALID;
    }
    c.consume();

    const t4 = c.current;
    const type = t4 && this.typeReader.read(c);
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
    if (Operator.matches(t3, '=')) {
      c.consume();

      const t4 = c.current;
      const _initExpr = t4 && this.expressionReader.read(c);
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
    if (Separator.matches(t5, ';')) {
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
