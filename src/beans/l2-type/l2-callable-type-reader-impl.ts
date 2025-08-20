import { Bean } from '@/util/beans';
import { combinePos, ERROR } from '../../base';
import { L1Bracket } from '../l1-reader/l1-bracket';
import { L1Operator } from '../l1-reader/l1-operator';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2ArgumentReader } from './l2-argument-reader';
import { L2CallableType } from './l2-callable-type';
import { L2CallableTypeReader } from './l2-callable-type-reader';
import { L2Type } from './l2-type';
import { L2TypeItemReader } from './l2-type-item-reader';
import { L2TypeReader } from './l2-type-reader';

export class L2CallableTypeReaderImpl extends Bean implements L2TypeItemReader, L2CallableTypeReader {
  typeReader: L2TypeReader;
  argumentReader: L2ArgumentReader;

  constructor([typeReader, argumentReader]: [L2TypeReader, L2ArgumentReader]) {
    super();
    this.typeReader = typeReader;
    this.argumentReader = argumentReader;
  }

  read(c: L2ParseContext): ReadResult<L2CallableType> {
    const t1 = c.current;
    if (!L1Bracket.matches(t1, '(')) {
      return;
    }
    c.consume();

    let returnType: L2Type | null = null;

    const c1 = new L2ParseContext(t1.tokenList);
    const args = this.argumentReader.readList(c1);
    c.errors.push(...c1.errors);

    const t2 = c.current;
    if (L1Operator.matches(t2, ':')) {
      c.consume();

      const _returnType = this.typeReader.read(c);
      if (_returnType === INVALID) {
        return INVALID;
      }
      if (!_returnType) {
        c.errors.push({
          level: ERROR,
          message: `Expected type`,
          pos: t2.pos,
        });
        return INVALID;
      }
      returnType = _returnType;
    }

    return new L2CallableType(args, returnType, combinePos(t1.pos, (returnType ?? t1).pos));
  }
}
