import { declareBeanInterface } from '@/util/beans';
import { L1Base } from '../l1-parser/l1-types';
import { L2ParseResult } from './l2-types';

export type L2Parser = {
  parse(list: L1Base[]): L2ParseResult;
};

export const l2Parser = declareBeanInterface<L2Parser>('L2Parser');
