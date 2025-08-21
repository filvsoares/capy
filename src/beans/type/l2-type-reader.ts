import { declareBeanInterface } from '@/util/beans';
import { L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L2Type } from './l2-type';

export interface L2TypeReader {
  read(c: L2ParseContext): ReadResult<L2Type>;
}

export const l2TypeReader = declareBeanInterface<L2TypeReader>('L2TypeReader');
