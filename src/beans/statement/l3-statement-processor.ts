import { L3ExpressionContext } from '@/beans/expression/l3-expression-processor';
import { L3StatementList } from '@/beans/statement/l3-statement-list';
import { L3Type } from '@/beans/type/l3-type';
import { declareBeanInterface } from '@/util/beans';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L2StatementList } from './l2-statement-list';

export interface L3StatementProcessor {
  processStatementList(
    c: L3ParseContext,
    src: L2StatementList,
    context: L3ExpressionContext,
    expectedReturnType: L3Type
  ): L3StatementList;
}

export const l3StatementProcessor = declareBeanInterface<L3StatementProcessor>('L3StatementProcessor');
