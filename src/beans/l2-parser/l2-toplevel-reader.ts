import { declareBeanInterface } from '@/util/beans';
import { L2ParseContext, ReadResult } from './l2-base';
import { L2Toplevel } from './l2-parser';

export interface L2ToplevelReader {
  read(c: L2ParseContext): ReadResult<L2Toplevel>;
}

export const l2ToplevelReader = declareBeanInterface<L2ToplevelReader>('L2ToplevelReader');
