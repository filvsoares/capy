import { Bean } from '@/util/beans';

import { combinePos, fallbackPos, INVALID, Invalid } from '@/base';
import { ExpressionReader } from '@/modules/parser/expression/expression-reader';
import { hasMethodData } from '@/modules/parser/method/method-data';
import { ReturnStatement } from '@/modules/parser/method/return-statement';
import { StatementReaderContext } from '@/modules/parser/statement/statement-reader';
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

  read(c: StatementReaderContext): ReturnStatement | Invalid | undefined {
    if (!hasMethodData(c)) {
      return;
    }

    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, 'return')) {
      return;
    }
    c.tokenReader.consume();

    const t2 = c.tokenReader.current;
    if (Separator.matches(t2, ';')) {
      c.tokenReader.consume();
      if (!isVoidType(c.methodData.returnType)) {
        c.parseErrors.addError(`Must return expression of type ${c.methodData.returnType}`, combinePos(t1.pos, t2.pos));
        return INVALID;
      }
      return new ReturnStatement(null, combinePos(t1.pos, t2.pos));
    }

    const expr = this.expressionReader.read(c, {
      unexpectedTokenErrorMsg: (t) => `Expected expression but found ${t}`,
    });
    if (expr === INVALID) {
      return INVALID;
    }
    if (!expr) {
      c.parseErrors.addError(`Expected expression but found ${t2}`, fallbackPos(t2?.pos, t1.pos));
      return INVALID;
    }

    const t3 = c.tokenReader.current;
    if (Separator.matches(t3, ';')) {
      c.tokenReader.consume();
    } else {
      c.parseErrors.addError(`Expected ";"`, fallbackPos(t3?.pos, expr.pos));
    }

    if (isVoidType(c.methodData.returnType)) {
      c.parseErrors.addError(`Cannot return expression when method has void return type`, expr.pos);
      return INVALID;
    }

    if (!this.typeReader.isAssignable(expr.type, c.methodData.returnType)) {
      c.parseErrors.addError(`Return expects ${c.methodData.returnType} but ${expr.type} was provided`, expr.pos);
      return INVALID;
    }
    return new ReturnStatement(expr, combinePos(t1.pos, expr.pos));
  }
}
