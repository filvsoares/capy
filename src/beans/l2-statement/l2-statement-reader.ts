import { Bean } from '@/util/beans';
import { L2StatementItemReader, L2StatementReader } from './_bean-interfaces';
import { INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2Statement } from './l2-statement';
import { L2StatementList } from './l2-statement-list';
import { ERROR, INTERNAL } from '@/beans/base';

export class L2StatementReaderImpl extends Bean implements L2StatementReader {
  itemReaders: L2StatementItemReader[];

  constructor([itemReaders]: [L2StatementItemReader[]]) {
    super();
    this.itemReaders = itemReaders;
  }

  read(c: L2ParseContext): ReadResult<L2Statement> {
    for (const itemReader of this.itemReaders) {
      const result = itemReader.read(c);
      if (result) {
        return result;
      }
    }
  }

  readList(c: L2ParseContext): L2StatementList {
    const outList: L2Statement[] = [];
    let error = false;
    while (c.current) {
      const val = this.read(c);
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = c.current!;
          c.errors.push({
            level: ERROR,
            message: `Unexpected ${t}`,
            pos: t.pos,
          });
        }
        c.consume();
        continue;
      }
      error = false;
      outList.push(val);
    }
    return new L2StatementList(outList, INTERNAL);
  }
}
