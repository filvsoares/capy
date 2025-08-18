import { declareBeanInterface } from '@/util/beans';
import { L2ParseContext, ReadResult } from '../../l2-types';
import { L2Toplevel } from './l2-toplevel';

export interface L2ToplevelItemReader {
  read(c: L2ParseContext): ReadResult<L2Toplevel>;
}

export const l2ToplevelItemReader = declareBeanInterface<L2ToplevelItemReader>('L2ToplevelItemReader');

export interface L2ToplevelReader {
  read(c: L2ParseContext): ReadResult<L2Toplevel>;
  readList(c: L2ParseContext): L2Toplevel[];
}

export const l2ToplevelReader = declareBeanInterface<L2ToplevelReader>('L2ToplevelReader');
