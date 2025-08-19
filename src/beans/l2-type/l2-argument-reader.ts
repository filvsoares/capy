import { Bean } from '@/util/beans';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2Argument } from './l2-argument';
import { L1Identifier } from '../l1-reader/l1-word';
import { L1Operator } from '../l1-reader/l1-operator';
import { combinePos, ERROR, fallbackPos, INTERNAL } from '../base';
import { L1Separator } from '../l1-reader/l1-separator';
import { L2ArgumentReader, L2TypeReader } from './_bean-interfaces';

export class L2ArgumentReaderImpl extends Bean implements L2ArgumentReader {
  typeReaders: L2TypeReader[];

  constructor([typeReaders]: [L2TypeReader[]]) {
    super();
    this.typeReaders = typeReaders;
  }

  read(c: L2ParseContext): ReadResult<L2Argument> {
    const t1 = c.current;
    if (!L1Identifier.matches(t1)) {
      return;
    }
    c.consume();

    const t2 = c.current;
    if (!L1Operator.matches(t2, ':')) {
      c.errors.push({
        level: ERROR,
        message: `Expected ":" but found ${t2 ?? '")"'}`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    c.consume();

    const t3 = c.current;
    const type = this.typeReaders[0].read(c);
    if (!type) {
      c.errors.push({
        level: ERROR,
        message: `Expected type but found ${t3}`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
      return INVALID;
    }
    if (type === INVALID) {
      return INVALID;
    }
    return new L2Argument(t1.name, type, combinePos(t1.pos, type.pos));
  }

  readList(c: L2ParseContext): L2Argument[] {
    const outList: L2Argument[] = [];
    let error = false;

    if (!c.current) {
      return outList;
    }

    while (c.current) {
      const arg = this.read(c);
      if (!arg) {
        if (!error) {
          error = true;
          c.errors.push({
            level: ERROR,
            message: `Expected identifier`,
            pos: INTERNAL,
          });
        }
        c.consume();
        continue;
      }
      if (arg === INVALID) {
        continue;
      }
      outList.push(arg);

      const t2 = c.current;
      if (!t2) {
        break;
      }
      if (!L1Separator.matches(t2, ',')) {
        error = true;
        c.errors.push({
          level: ERROR,
          message: `Expected "," but found ${t2}`,
          pos: t2.pos,
        });
        c.consume();
        continue;
      }
      c.consume();

      const t3 = c.current;
      if (!t3) {
        c.errors.push({
          level: ERROR,
          message: `Expected argument after ","`,
          pos: t2.pos,
        });
        break;
      }
    }

    return outList;
  }
}
