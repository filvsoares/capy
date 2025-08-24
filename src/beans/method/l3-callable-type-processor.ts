import { Invalid } from '@/beans/l3-parser/l3-base';
import { L3ParseContext } from '@/beans/l3-parser/l3-parser';
import { L2CallableType } from '@/beans/method/l2-callable-type';
import { L3CallableType } from '@/beans/method/l3-callable-type';
import { declareBeanInterface } from '@/util/beans';

export interface L3CallableTypeProcessor {
  processCallableType(c: L3ParseContext, obj: L2CallableType): L3CallableType | Invalid;
}

export const l3CallableTypeProcessor = declareBeanInterface<L3CallableTypeProcessor>('L3CallableTypeProcessor');
