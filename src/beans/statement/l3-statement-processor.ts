import { declareBeanInterface } from '@/util/beans';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L3StatementList } from '../method/l3-method';
import { MethodStack } from '../method/l3-method-processor';
import { L3Type } from '../type/l3-types';
import { L2StatementList } from './l2-statement-list';

export interface L3StatementProcessor {
  processStatementList(
    c: L3ParseContext,
    src: L2StatementList,
    stack: MethodStack,
    expectedReturnType: L3Type
  ): L3StatementList;
}

export const l3StatementProcessor = declareBeanInterface<L3StatementProcessor>('L3StatementProcessor');
