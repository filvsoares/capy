import { combinePos, ERROR, fallbackPos, Pos } from '@/parser/base';
import { L1Separator } from '@/parser/layer1/reader/l1-separator';
import { L1String } from '@/parser/layer1/reader/l1-string';
import { L1Keyword } from '@/parser/layer1/reader/l1-word';
import { INVALID, L2Base, L2ParseContext, ReadResult } from '../../l2-types';
import { Bean } from '@/util/beans';
import { L2ToplevelItemReader } from './_bean-interfaces';
import { L2Use } from './l2-use';

export class L2UseReader extends Bean implements L2ToplevelItemReader {
  read(c: L2ParseContext): ReadResult<L2Use> {
    const t1 = c.current;
    if (!L1Keyword.matches(t1, 'use')) {
      return;
    }
    c.consume();

    const t2 = c.current;
    if (!L1String.matches(t2)) {
      c.errors.push({
        level: ERROR,
        message: `Expected string`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    c.consume();

    const t3 = c.current;
    if (L1Separator.matches(t3, ';')) {
      c.consume();
    } else {
      c.errors.push({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
    }

    return new L2Use(t2.value, combinePos(t1.pos, (t3 ?? t2).pos));
  }
}
