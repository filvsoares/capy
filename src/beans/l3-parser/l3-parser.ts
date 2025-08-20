import { declareBeanInterface } from '@/util/beans';
import { ParseError } from '../../base';
import { L2Base } from '../l2-parser/l2-types';
import { L3Module } from './l3-types';

export type L3ParseResult = {
  runnable: L3Module;
  errors: ParseError[];
};

export interface L3Parser {
  parse(moduleName: string, list: L2Base[], modules: L3Module[]): L3ParseResult;
}

export const l3Parser = declareBeanInterface<L3Parser>('L3Parser');
