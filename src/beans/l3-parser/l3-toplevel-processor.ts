import { L2Toplevel } from '@/beans/l2-parser/l2-parser';
import { declareBeanInterface } from '@/util/beans';
import { L3ParseContext } from './l3-parser';

export interface L3ToplevelProcessor {
  process(c: L3ParseContext, item: L2Toplevel): boolean;
}

export const l3ToplevelProcessor = declareBeanInterface<L3ToplevelProcessor>('L3ToplevelProcessor');
