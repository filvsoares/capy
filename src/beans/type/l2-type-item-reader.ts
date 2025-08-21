import { declareBeanInterface } from '@/util/beans';
import { L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L2Type } from './l2-type';

export interface L2TypeItemReader {
  read(c: L2ParseContext): ReadResult<L2Type>;
}

export const l2TypeItemReader = declareBeanInterface<L2TypeItemReader>('L2TypeItemReader');
