import { Bean } from '@/util/beans';
import { L1Identifier, L1Keyword } from '../l1-parser/l1-word';
import { L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L2SimpleType } from './l2-simple-type';
import { L2TypeItemReader } from './l2-type-item-reader';

export class L2SimpleTypeReader extends Bean implements L2TypeItemReader {
  read(c: L2ParseContext): ReadResult<L2SimpleType> {
    const t1 = c.current;
    if (L1Keyword.matches(t1) || L1Identifier.matches(t1)) {
      c.consume();
      return new L2SimpleType(t1.name, t1.pos);
    }
  }
}
