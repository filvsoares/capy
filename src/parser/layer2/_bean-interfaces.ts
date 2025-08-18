import { declareBeanInterface } from '@/util/beans';
import { L2Base, L2ParseContext, L2ParseResult } from './l2-types';
import { L1Base } from '../layer1/l1-types';

export type L2Parser = {
  parse(list: L1Base[]): L2ParseResult;
};

export const l2Parser = declareBeanInterface<L2Parser>('L2Parser');
