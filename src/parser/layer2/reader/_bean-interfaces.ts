import { declareBeanInterface } from '@/util/beans';
import { L2Base, L2ParseContext } from '../l2-types';

export interface L2Reader {
  read(c: L2ParseContext): L2Base | true | undefined;
}

export const l2Reader = declareBeanInterface<L2Reader>('L2Reader');
