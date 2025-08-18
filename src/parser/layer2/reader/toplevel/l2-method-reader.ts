import { combinePos, ERROR, fallbackPos, Pos } from '@/parser/base';
import { L1Identifier, L1Keyword } from '@/parser/layer1/reader/l1-word';
import { INVALID, L2ParseContext, ReadResult } from '../../l2-types';
import { L2Method } from './l2-method';
import { readCallableType } from '../l2-callable-type';
import { Bean } from '@/util/beans';
import { L2ToplevelItemReader } from './_bean-interfaces';
import { L2StatementReader } from '../statement/_bean-interfaces';
import { L1Bracket } from '@/parser/layer1/reader/l1-bracket';

export class L2MethodReader extends Bean implements L2ToplevelItemReader {
  statementReaders: L2StatementReader[];

  constructor([statementReaders]: [L2StatementReader[]]) {
    super();
    this.statementReaders = statementReaders;
  }

  read(c: L2ParseContext): ReadResult<L2Method> {
    const t1 = c.current;
    if (!L1Keyword.matches(t1, 'function')) {
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
    let type = t3 && readCallableType(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.errors.push({
        level: ERROR,
        message: `Expected type1`,
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
    const statementList = this.statementReaders[0].readList(c1);
    c.errors.push(...c1.errors);

    return new L2Method(t2.name, type, statementList, combinePos(t1.pos, t4.pos));
  }
}
