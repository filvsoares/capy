import { Bean } from '@/util/beans';
import { L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L2Type } from './l2-type';
import { L2TypeItemReader } from './l2-type-item-reader';
import { L2TypeReader } from './l2-type-reader';

export class L2TypeReaderImpl extends Bean implements L2TypeReader {
  itemReaders: L2TypeReader[];
  constructor([itemReaders]: [L2TypeItemReader[]]) {
    super();
    this.itemReaders = itemReaders;
  }

  read(c: L2ParseContext): ReadResult<L2Type> {
    for (const itemReader of this.itemReaders) {
      const result = itemReader.read(c);
      if (result) {
        return result;
      }
    }
  }
}
