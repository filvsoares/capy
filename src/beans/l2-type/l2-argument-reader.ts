import { declareBeanInterface } from '@/util/beans';
import { L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2Argument } from './l2-argument';

export interface L2ArgumentReader {
  read(c: L2ParseContext): ReadResult<L2Argument>;
  readList(c: L2ParseContext): L2Argument[];
}

export const l2ArgumentReader = declareBeanInterface<L2ArgumentReader>('L2ArgumentReader');
