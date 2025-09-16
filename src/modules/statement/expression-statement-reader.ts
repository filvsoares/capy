import { combinePos, fallbackPos, INVALID, Invalid } from '@/base';
import { ExpressionReader } from '@/modules/expression/expression-reader';
import { ExpressionStatement } from '@/modules/statement/expression-statement';
import { StatementReaderContext } from '@/modules/statement/statement-reader';
import { Bean } from '@/util/beans';
import { Separator } from '../tokenizer/separator';
import { StatementItemReader } from './statement-item-reader';

export class ExpressionStatementReader extends Bean implements StatementItemReader {
  priority = -1000;

  constructor(private expressionReader: ExpressionReader) {
    super();
  }

  read(c: StatementReaderContext): ExpressionStatement | Invalid | undefined {
    const val = this.expressionReader.read(c, {
      unexpectedTokenErrorMsg: (t) => `Expected ";" but found ${t}`,
    });
    if (val === INVALID) {
      return INVALID;
    }
    if (!val) {
      return;
    }

    const t = c.tokenReader.current;
    if (Separator.matches(t, ';')) {
      c.tokenReader.consume();
    } else {
      c.parseErrors.addError(`Expected ";"`, fallbackPos(t?.pos, val.pos));
    }

    return new ExpressionStatement(val, combinePos(val.pos, (t ?? val).pos));
  }
}
