import { L1Base } from '@/beans/l1-parser/l1-base';
import { L1ParserContext } from '@/beans/l1-parser/l1-parser';
import { declareBeanInterface } from '@/util/beans';

export interface L1Reader {
  read(c: L1ParserContext): L1Base | true | undefined;
}

export const l1Reader = declareBeanInterface<L1Reader>('L1Reader');
