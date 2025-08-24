import { Invalid } from '@/beans/l3-parser/l3-base';
import { L3ParseContext } from '@/beans/l3-parser/l3-parser';
import { L2Type } from '@/beans/type/l2-type';
import { L3Type } from '@/beans/type/l3-type';
import { declareBeanInterface } from '@/util/beans';

export interface L3TypeProcessor {
  processType(c: L3ParseContext, obj: L2Type): L3Type | Invalid;
  isAssignable(type: L3Type, assignTo: L3Type): boolean;
}

export const l3TypeProcessor = declareBeanInterface<L3TypeProcessor>('L3TypeProcessor');
