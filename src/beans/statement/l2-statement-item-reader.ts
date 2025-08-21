import { declareBeanInterface } from '@/util/beans';
import { L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L2Statement } from './l2-statement';

export interface L2StatementItemReader {
  read(c: L2ParseContext): ReadResult<L2Statement>;
}

export const l2StatementItemReader = declareBeanInterface<L2StatementItemReader>('L2StatementItemReader');
