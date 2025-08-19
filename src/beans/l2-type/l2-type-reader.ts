import { Bean } from '@/util/beans';
import { L2TypeItemReader, L2TypeReader } from './_bean-interfaces';
import { L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2Type } from './l2-type';

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
