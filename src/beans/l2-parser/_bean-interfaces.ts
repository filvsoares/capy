import { declareBeanInterface } from '@/util/beans';
import { L2Base, L2ParseContext, L2ParseResult, L2Toplevel, ReadResult } from './l2-types';
import { L1Base } from '../l1-parser/l1-types';

export type L2Parser = {
  parse(list: L1Base[]): L2ParseResult;
};

export const l2Parser = declareBeanInterface<L2Parser>('L2Parser');

export interface L2ToplevelReader {
  read(c: L2ParseContext): ReadResult<L2Toplevel>;
  readList(c: L2ParseContext): L2Toplevel[];
}

export const l2ToplevelReader = declareBeanInterface<L2ToplevelReader>('L2ToplevelReader');
