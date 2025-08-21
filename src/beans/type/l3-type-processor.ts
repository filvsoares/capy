import { declareBeanInterface } from '@/util/beans';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L2CallableType } from './l2-callable-type';
import { L2Type } from './l2-type';
import { Invalid, L3CallableType, L3Type } from './l3-types';

export interface L3TypeProcessor {
  processType(c: L3ParseContext, src: L2Type): L3Type | Invalid;
  processCallableType(c: L3ParseContext, src: L2CallableType): L3CallableType | Invalid;
  isAssignable(type: L3Type, assignTo: L3Type): boolean;
}

export const l3TypeProcessor = declareBeanInterface<L3TypeProcessor>('L3TypeProcessor');
