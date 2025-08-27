import { ERROR, INTERNAL, INVALID, Invalid } from '@/base';
import { ParserContext } from '@/beans/parser/parser-context';
import { Statement } from '@/beans/statement/statement';
import { StatementContext } from '@/beans/statement/statement-context';
import { StatementReader } from '@/beans/statement/statement-reader';
import { Type } from '@/beans/type/type';
import { Bean } from '@/util/beans';
import { StatementItemReader } from './statement-item-reader';
import { StatementList } from './statement-list';

export class StatementReaderImpl extends Bean implements StatementReader {
  constructor(private itemReaders: StatementItemReader[]) {
    super();
    this.itemReaders = itemReaders;
  }

  read(c: ParserContext, context: StatementContext, expectedReturnType: Type): Statement | Invalid | undefined {
    for (const itemReader of this.itemReaders) {
      const result = itemReader.read(c, context, expectedReturnType);
      if (result) {
        return result;
      }
    }
  }

  readList(c: ParserContext, context: StatementContext, expectedReturnType: Type): StatementList {
    const outList: Statement[] = [];
    let error = false;
    while (c.current) {
      const val = this.read(c, context, expectedReturnType);
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = c.current!;
          c.addError({
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
    return new StatementList(outList, INTERNAL);
  }
}
