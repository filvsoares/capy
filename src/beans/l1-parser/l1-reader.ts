import { declareBeanInterface } from '@/util/beans';
import { L1Base, L1ParseContext, L1ParseResult } from '@/beans/l1-parser/l1-types';

export interface L1Reader {
  read(c: L1ParseContext): L1Base | true | undefined;
}

export const l1Reader = declareBeanInterface<L1Reader>('L1Reader');
