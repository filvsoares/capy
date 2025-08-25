import { combinePos, ERROR, fallbackPos } from '@/base';
import { L2CallableTypeReader } from '@/beans/method/callable-type-reader';
import { Keyword } from '@/beans/parser/keyword';
import { Bean } from '@/util/beans';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L1Bracket } from '../parser/bracket';
import { L1Identifier } from '../parser/identifier';
import { L2ToplevelReader } from '../parser/toplevel-reader';
import { L2StatementReader } from '../statement/statement-reader';
import { L2Method } from './l2-method';

export class L2MethodReader extends Bean implements L2ToplevelReader {
  constructor(private statementReader: L2StatementReader, private callableTypeReader: L2CallableTypeReader) {
    super();
  }

  read(c: L2ParseContext): ReadResult<L2Method> {
    const t1 = c.current;
    if (!Keyword.matches(t1, 'function')) {
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

    const t3 = c.current;
    const type = t3 && this.callableTypeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.errors.push({
        level: ERROR,
        message: `Expected type`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
      return INVALID;
    }

    const t4 = c.current;
    if (!L1Bracket.matches(t4, '{')) {
      c.errors.push({
        level: ERROR,
        message: `Expected "{" but found ${t4}`,
        pos: fallbackPos(t4?.pos, type.pos),
      });
      return INVALID;
    }
    c.consume();

    const c1 = new L2ParseContext(t4.tokenList);
    const statementList = this.statementReader.readList(c1);
    c.errors.push(...c1.errors);

    return new L2Method(t2.name, type, statementList, combinePos(t1.pos, t4.pos));
  }
}
