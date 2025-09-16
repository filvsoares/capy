import { INTERNAL, INVALID, Invalid } from '@/base';
import { Statement } from '@/modules/statement/statement';
import { StatementReader, StatementReaderContext } from '@/modules/statement/statement-reader';
import { Bean } from '@/util/beans';
import { StatementItemReader } from './statement-item-reader';
import { StatementList } from './statement-list';

export class StatementReaderImpl extends Bean implements StatementReader {
  constructor(private itemReaders: StatementItemReader[]) {
    super();
    this.itemReaders = itemReaders;
  }

  read(c: StatementReaderContext): Statement | Invalid | undefined {
    for (const itemReader of this.itemReaders) {
      const result = itemReader.read(c);
      if (result) {
        return result;
      }
    }
  }

  readList(c: StatementReaderContext): StatementList {
    const outList: Statement[] = [];
    let error = false;
    while (c.tokenReader.current) {
      const val = this.read(c);
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = c.tokenReader.current!;
          c.parseErrors.addError(`Unexpected ${t}`, t.pos);
        }
        c.tokenReader.consume();
        continue;
      }
      error = false;
      outList.push(val);
    }
    return new StatementList(outList, INTERNAL);
  }
}
