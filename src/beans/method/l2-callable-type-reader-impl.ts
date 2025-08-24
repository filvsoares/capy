import { L2CallableType } from '@/beans/method/l2-callable-type';
import { L2CallableTypeReader } from '@/beans/method/l2-callable-type-reader';
import { Type } from '@/beans/type/type';
import { TypeItemReader } from '@/beans/type/type-item-reader';
import { TypeReader } from '@/beans/type/type-reader';
import { Bean } from '@/util/beans';
import { combinePos, ERROR } from '../../base';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L1Bracket } from '../parser/bracket';
import { Operator } from '../parser/operator';
import { L2ArgumentReader } from './l2-argument-reader';

export class L2CallableTypeReaderImpl extends Bean implements TypeItemReader, L2CallableTypeReader {
  constructor(private typeReader: TypeReader, private argumentReader: L2ArgumentReader) {
    super();
  }

  read(c: L2ParseContext): ReadResult<L2CallableType> {
    const t1 = c.current;
    if (!L1Bracket.matches(t1, '(')) {
      return;
    }
    c.consume();

    let returnType: Type | null = null;

    const c1 = new L2ParseContext(t1.tokenList);
    const args = this.argumentReader.readList(c1);
    c.errors.push(...c1.errors);

    const t2 = c.current;
    if (Operator.matches(t2, ':')) {
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
