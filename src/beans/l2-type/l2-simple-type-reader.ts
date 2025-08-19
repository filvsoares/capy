import { Bean } from '@/util/beans';
import { L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2TypeItemReader } from './_bean-interfaces';
import { L2SimpleType } from './l2-simple-type';
import { L1Identifier, L1Keyword } from '../l1-reader/l1-word';

export class L2SimpleTypeReader extends Bean implements L2TypeItemReader {
  read(c: L2ParseContext): ReadResult<L2SimpleType> {
    const t1 = c.current;
    if (L1Keyword.matches(t1) || L1Identifier.matches(t1)) {
      c.consume();
      return new L2SimpleType(t1.name, t1.pos);
    }
  }
}
