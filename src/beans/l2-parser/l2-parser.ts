import { ParseError } from '@/base';
import { L1Base } from '@/beans/l1-parser/l1-base';
import { declareBeanInterface } from '@/util/beans';
import { L2Base } from './l2-base';

export abstract class L2Toplevel extends L2Base {}

export type L2ParseResult = {
  list: L2Toplevel[];
  errors: ParseError[];
};

export type L2Parser = {
  parse(list: L1Base[]): L2ParseResult;
};

export const l2Parser = declareBeanInterface<L2Parser>('L2Parser');
