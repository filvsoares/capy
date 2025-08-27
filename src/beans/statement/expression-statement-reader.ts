import { combinePos, ERROR, fallbackPos, INVALID, Invalid } from '@/base';
import { ExpressionReader } from '@/beans/expression/expression-reader';
import { ParserContext } from '@/beans/parser/parser-context';
import { ExpressionStatement } from '@/beans/statement/expression-statement';
import { StatementContext } from '@/beans/statement/statement-context';
import { Type } from '@/beans/type/type';
import { Bean } from '@/util/beans';
import { Separator } from '../tokenizer/separator';
import { StatementItemReader } from './statement-item-reader';

export class ExpressionStatementReader extends Bean implements StatementItemReader {
  constructor(private expressionReader: ExpressionReader) {
    super();
  }

  read(
    c: ParserContext,
    context: StatementContext,
    expectedReturnType: Type
  ): ExpressionStatement | Invalid | undefined {
    const val = this.expressionReader.read(c, context, {
      unexpectedTokenErrorMsg: (t) => `Expected ";" but found ${t}`,
    });
    if (val === INVALID) {
      return INVALID;
    }
    if (!val) {
      return;
    }

    const t = c.current;
    if (Separator.matches(t, ';')) {
      c.consume();
    } else {
      c.addError({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t?.pos, val.pos),
      });
    }

    return new ExpressionStatement(val, combinePos(val.pos, (t ?? val).pos));
  }
}
