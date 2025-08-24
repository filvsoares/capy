import { Invalid } from '@/beans/l3-parser/l3-base';
import { L3ParseContext } from '@/beans/l3-parser/l3-parser';
import { L3Type } from '@/beans/type/l3-type';
import { declareBeanInterface } from '@/util/beans';
import { L2Type } from './l2-type';

export interface L3TypeItemProcessor {
  processType(c: L3ParseContext, obj: L2Type): L3Type | Invalid | undefined;
  isAssignable(type: L3Type, assignTo: L3Type): boolean | undefined;
}

export const l3TypeItemProcessor = declareBeanInterface<L3TypeItemProcessor>('L3TypeItemProcessor');
