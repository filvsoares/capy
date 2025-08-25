import { combinePos, ERROR, fallbackPos, Invalid, INVALID } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { ExpressionReader } from '@/beans/expression/expression-reader';
import { GlobalVariable } from '@/beans/global-variable/global-variable';
import { Identifier } from '@/beans/parser/identifier';
import { Keyword } from '@/beans/parser/keyword';
import { Operator } from '@/beans/parser/operator';
import { ParserContext } from '@/beans/parser/parser';
import { Separator } from '@/beans/parser/separator';
import { ToplevelReader } from '@/beans/parser/toplevel-reader';
import { Bean } from '@/util/beans';
import { TypeReader } from '../type/type-reader';

export class GlobalVariableReader extends Bean implements ToplevelReader {
  constructor(private typeReader: TypeReader, private expressionReader: ExpressionReader) {
    super();
  }

  read(c: ParserContext): true | Invalid | undefined {
    const t1 = c.current();
    if (!Keyword.matches(t1, 'var')) {
      return;
    }
    c.consume();

    const t2 = c.current();
    if (!Identifier.matches(t2)) {
      c.addError({
        level: ERROR,
        message: `Expected identifier`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    c.consume();

    let t3 = c.current();
    if (!Operator.matches(t3, ':')) {
      c.addError({
        level: ERROR,
        message: `Expected ":"`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
      return INVALID;
    }
    c.consume();

    const t4 = c.current();
    const type = t4 && this.typeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.addError({
        level: ERROR,
        message: `Expected type`,
        pos: fallbackPos(t4?.pos, t3.pos),
      });
      return INVALID;
    }

    t3 = c.current();
    let initExpr: Expression | null = null;
    if (Operator.matches(t3, '=')) {
      c.consume();

      const t4 = c.current();
      const _initExpr = t4 && this.expressionReader.read(c, null);
      if (_initExpr === INVALID) {
        return INVALID;
      }
      if (!_initExpr) {
        c.addError({
          level: ERROR,
          message: `Expected initializer`,
          pos: fallbackPos(t4?.pos, t3.pos),
        });
        return INVALID;
      }
      initExpr = _initExpr;
    }

    const t5 = c.current();
    if (Separator.matches(t5, ';')) {
      c.consume();
    } else {
      c.addError({
        level: ERROR,
        message: type === initExpr ? `Expected ";"` : `Expected "=" or ";"`,
        pos: fallbackPos(t5?.pos, t3!.pos),
      });
    }

    if (!c.addToMySymbols(new GlobalVariable(t2.name, type, initExpr, combinePos(t1.pos, (t5 ?? t2).pos)))) {
      c.addError({
        level: ERROR,
        message: `Symbol '${t2.name}' already defined`,
        pos: t2.pos,
      });
      return INVALID;
    }

    return true;
  }
}
