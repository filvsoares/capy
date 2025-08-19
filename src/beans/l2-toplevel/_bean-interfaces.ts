import { declareBeanInterface } from '@/util/beans';
import { L2ParseContext, L2Toplevel, ReadResult } from '../l2-parser/l2-types';

export interface L2ToplevelItemReader {
  read(c: L2ParseContext): ReadResult<L2Toplevel>;
}

export const l2ToplevelItemReader = declareBeanInterface<L2ToplevelItemReader>('L2ToplevelItemReader');
