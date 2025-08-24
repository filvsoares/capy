import { Invalid } from '@/beans/l3-parser/l3-base';
import { L3ParseContext } from '@/beans/l3-parser/l3-parser';
import { L2Statement } from '@/beans/statement/l2-statement';
import { L3Statement } from '@/beans/statement/l3-statement';
import { L3StatementContext } from '@/beans/statement/l3-statement-context';
import { L3Type } from '@/beans/type/l3-type';
import { declareBeanInterface } from '@/util/beans';

export interface L3StatementHandler {
  processStatement(
    c: L3ParseContext,
    src: L2Statement,
    context: L3StatementContext,
    expectedReturnType: L3Type
  ): L3Statement | Invalid | undefined;
}

export const l3StatementHandler = declareBeanInterface<L3StatementHandler>('L3StatementHandler');
