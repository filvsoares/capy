import { ERROR } from '@/parser/base';
import { INVALID, L2Base, L2ParseContext, ReadResult } from '../../l2-types';
import { L2ToplevelItemReader, L2ToplevelReader } from './_bean-interfaces';
import { Bean } from '@/util/beans';
import { L2Toplevel } from './l2-toplevel';

export class L2ToplevelReaderImpl extends Bean implements L2ToplevelReader {
  itemReaders: L2ToplevelItemReader[];
  constructor([itemReaders]: [L2ToplevelItemReader[]]) {
    super();
    this.itemReaders = itemReaders;
  }

  read(c: L2ParseContext): ReadResult<L2Toplevel> {
    for (const itemReader of this.itemReaders) {
      const result = itemReader.read(c);
      if (result) {
        return result;
      }
    }
  }

  readList(c: L2ParseContext): L2Toplevel[] {
    const outList: L2Toplevel[] = [];
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
          const t = c.current;
          c.errors.push({
            level: ERROR,
            message: `Unexpected ${t}`,
            pos: {
              lin1: t.pos.lin1,
              col1: t.pos.col1,
              lin2: t.pos.lin2,
              col2: t.pos.col2,
            },
          });
        }
        c.consume();
        continue;
      }
      error = false;
      outList.push(val);
    }
    return outList;
  }
}
