import { Bean } from '@/util/beans';
import { L2ArgumentReader, L2CallableTypeReader, L2TypeItemReader, L2TypeReader } from './_bean-interfaces';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2CallableType } from './l2-callable-type';
import { L1Bracket } from '../l1-reader/l1-bracket';
import { L2Type } from './l2-type';
import { L1Operator } from '../l1-reader/l1-operator';
import { combinePos, ERROR } from '../base';

export class L2CallableTypeReaderImpl extends Bean implements L2TypeItemReader, L2CallableTypeReader {
  typeReaders: L2TypeReader[];
  argumentReaders: L2ArgumentReader[];

  constructor([typeReaders, argumentReaders]: [L2TypeReader[], L2ArgumentReader[]]) {
    super();
    this.typeReaders = typeReaders;
    this.argumentReaders = argumentReaders;
  }

  read(c: L2ParseContext): ReadResult<L2CallableType> {
    const t1 = c.current;
    if (!L1Bracket.matches(t1, '(')) {
      return;
    }
    c.consume();

    let returnType: L2Type | null = null;

    const c1 = new L2ParseContext(t1.tokenList);
    const args = this.argumentReaders[0].readList(c1);
    c.errors.push(...c1.errors);

    const t2 = c.current;
    if (L1Operator.matches(t2, ':')) {
      c.consume();

      const _returnType = this.typeReaders[0].read(c);
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
