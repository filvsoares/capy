import { declareBeanInterface } from '@/util/beans';
import { L1Base, L1ParseContext, L1ParseResult } from '@/parser/layer1/l1-types';

export type L1Parser = {
  read: (c: L1ParseContext) => L1Base | true | undefined;
  parse(s: string): L1ParseResult;
};

export const l1Parser = declareBeanInterface<L1Parser>('L1Parser');
