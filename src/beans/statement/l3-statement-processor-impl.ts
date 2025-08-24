import { ERROR } from '@/base';
import { INVALID } from '@/beans/l3-parser/l3-base';
import { L3StatementContext } from '@/beans/statement/l3-statement-context';
import { L3StatementHandler } from '@/beans/statement/l3-statement-handler';
import { L3StatementList } from '@/beans/statement/l3-statement-list';
import { L3Type } from '@/beans/type/l3-type';
import { Bean } from '@/util/beans';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L2StatementList } from './l2-statement-list';
import { L3StatementProcessor } from './l3-statement-processor';

export class L3StatementProcessorImpl extends Bean implements L3StatementProcessor {
  constructor(private l3StatementHandlers: L3StatementHandler[]) {
    super();
  }

  processStatementList(
    c: L3ParseContext,
    src: L2StatementList,
    context: L3StatementContext,
    expectedReturnType: L3Type
  ) {
    const dst = new L3StatementList([], src.pos);
    loop: for (const item of src.list) {
      if (item instanceof L2StatementList) {
        const dstItem = this.processStatementList(c, item, context.createChild(), expectedReturnType);
        dst.list.push(dstItem);
        continue;
      }
      for (const h of this.l3StatementHandlers) {
        const result = h.processStatement(c, item, context, expectedReturnType);
        if (result) {
          if (result !== INVALID) {
            dst.list.push(result);
          }
          continue loop;
        }
      }
      c.errors.push({
        level: ERROR,
        message: `I still don't understand ${item.constructor.name}`,
        pos: item.pos,
      });
    }
    return dst;
  }
}
