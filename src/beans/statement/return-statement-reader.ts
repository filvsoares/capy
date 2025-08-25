import { Bean } from '@/util/beans';

import { combinePos, ERROR, fallbackPos, INVALID, Invalid } from '@/base';
import { ExpressionReader } from '@/beans/expression/expression-reader';
import { Keyword } from '@/beans/parser/keyword';
import { ParserContext } from '@/beans/parser/parser';
import { ReturnStatement } from '@/beans/statement/return-statement';
import { StatementContext } from '@/beans/statement/statement-context';
import { isVoidType } from '@/beans/type/simple-type';
import { Type } from '@/beans/type/type';
import { TypeReader } from '@/beans/type/type-reader';
import { Separator } from '../parser/separator';
import { StatementItemReader } from './statement-item-reader';
export class ReturnStatementReader extends Bean implements StatementItemReader {
  priority = 100;

  constructor(private expressionReader: ExpressionReader, private typeReader: TypeReader) {
    super();
  }

  read(c: ParserContext, context: StatementContext, expectedReturnType: Type): ReturnStatement | Invalid | undefined {
    const t1 = c.current();
    if (!Keyword.matches(t1, 'return')) {
      return;
    }
    c.consume();

    const t2 = c.current();
    if (Separator.matches(t2, ';')) {
      c.consume();
      if (!isVoidType(expectedReturnType)) {
        c.addError({
          level: ERROR,
          message: `Must return expression of type ${expectedReturnType}`,
          pos: combinePos(t1.pos, t2.pos),
        });
        return INVALID;
      }
      return new ReturnStatement(null, combinePos(t1.pos, t2.pos));
    }

    const expr = this.expressionReader.read(c, context, {
      unexpectedTokenErrorMsg: (t) => `Expected expression but found ${t}`,
    });
    if (expr === INVALID) {
      return INVALID;
    }
    if (!expr) {
      c.addError({
        level: ERROR,
        message: `Expected expression but found ${t2}`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }

    const t3 = c.current();
    if (Separator.matches(t3, ';')) {
      c.consume();
    } else {
      c.addError({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t3?.pos, expr.pos),
      });
    }

    if (isVoidType(expectedReturnType)) {
      c.addError({
        level: ERROR,
        message: `Cannot return expression when method has void return type`,
        pos: expr.pos,
      });
      return INVALID;
    }

    if (!this.typeReader.isAssignable(expr.type, expectedReturnType)) {
      c.addError({
        level: ERROR,
        message: `Return expects ${expectedReturnType} but ${expr.type} was provided`,
        pos: expr.pos,
      });
      return INVALID;
    }
    return new ReturnStatement(expr, combinePos(t1.pos, expr.pos));
  }
}
