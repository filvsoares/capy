import { declareBeanInterface } from '@/util/beans';
import { L2Definition } from '../definition/l2-definition';
import { L3ParseContext } from './l3-parser';

export interface L3ToplevelProcessor {
  process(c: L3ParseContext, def: L2Definition): boolean;
}

export const l3ToplevelProcessor = declareBeanInterface<L3ToplevelProcessor>('L3ToplevelProcessor');
