import { Bean } from '@/util/beans';

import { combinePos, ERROR, fallbackPos, INVALID, Invalid } from '@/base';
import { ExpressionReader } from '@/modules/parser/expression/expression-reader';
import { MethodContext } from '@/modules/parser/method/method-context';
import { ReturnStatement } from '@/modules/parser/method/return-statement';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { StatementContext } from '@/modules/parser/statement/statement-context';
import { Keyword } from '@/modules/parser/tokenizer/keyword';
import { isVoidType } from '@/modules/parser/type/simple-type';
import { TypeReader } from '@/modules/parser/type/type-reader';
import { StatementItemReader } from '../statement/statement-item-reader';
import { Separator } from '../tokenizer/separator';
export class ReturnStatementReader extends Bean implements StatementItemReader {
  priority = 100;

  constructor(private expressionReader: ExpressionReader, private typeReader: TypeReader) {
    super();
  }

  read(c: ParserContext, context: StatementContext): ReturnStatement | Invalid | undefined {
    if (!(context instanceof MethodContext)) {
      return;
    }

    const t1 = c.current;
    if (!Keyword.matches(t1, 'return')) {
      return;
    }
    c.consume();

    const t2 = c.current;
    if (Separator.matches(t2, ';')) {
      c.consume();
      if (!isVoidType(context.returnType)) {
        c.addError({
          level: ERROR,
          message: `Must return expression of type ${context.returnType}`,
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

    const t3 = c.current;
    if (Separator.matches(t3, ';')) {
      c.consume();
    } else {
      c.addError({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t3?.pos, expr.pos),
      });
    }

    if (isVoidType(context.returnType)) {
      c.addError({
        level: ERROR,
        message: `Cannot return expression when method has void return type`,
        pos: expr.pos,
      });
      return INVALID;
    }

    if (!this.typeReader.isAssignable(expr.type, context.returnType)) {
      c.addError({
        level: ERROR,
        message: `Return expects ${context.returnType} but ${expr.type} was provided`,
        pos: expr.pos,
      });
      return INVALID;
    }
    return new ReturnStatement(expr, combinePos(t1.pos, expr.pos));
  }
}
