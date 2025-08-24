import { L2Argument } from '@/beans/method/l2-argument';
import { TypeReader } from '@/beans/type/type-reader';
import { Bean } from '@/util/beans';
import { combinePos, ERROR, fallbackPos, INTERNAL } from '../../base';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L1Identifier } from '../parser/identifier';
import { Operator } from '../parser/operator';
import { Separator } from '../parser/separator';
import { L2ArgumentReader } from './l2-argument-reader';

export class L2ArgumentReaderImpl extends Bean implements L2ArgumentReader {
  constructor(private typeReader: TypeReader) {
    super();
  }

  read(c: L2ParseContext): ReadResult<L2Argument> {
    const t1 = c.current;
    if (!L1Identifier.matches(t1)) {
      return;
    }
    c.consume();

    const t2 = c.current;
    if (!Operator.matches(t2, ':')) {
      c.errors.push({
        level: ERROR,
        message: `Expected ":" but found ${t2 ?? '")"'}`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    c.consume();

    const t3 = c.current;
    const type = this.typeReader.read(c);
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
      if (!Separator.matches(t2, ',')) {
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
