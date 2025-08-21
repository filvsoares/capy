import { L1Base, L1ParseContext } from '@/beans/l1-parser/l1-types';
import { declareBeanInterface } from '@/util/beans';

export interface L1Reader {
  read(c: L1ParseContext): L1Base | true | undefined;
}

export const l1Reader = declareBeanInterface<L1Reader>('L1Reader');
