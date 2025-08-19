import { declareBeanInterface } from '@/util/beans';
import { L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2Statement } from './l2-statement';
import { L2StatementList } from './l2-statement-list';

export interface L2StatementItemReader {
  read(c: L2ParseContext): ReadResult<L2Statement>;
}

export const l2StatementItemReader = declareBeanInterface<L2StatementItemReader>('L2StatementItemReader');

export interface L2StatementReader {
  read(c: L2ParseContext): ReadResult<L2Statement>;
  readList(c: L2ParseContext): L2StatementList;
}

export const l2StatementReader = declareBeanInterface<L2StatementReader>('L2StatementReader');
