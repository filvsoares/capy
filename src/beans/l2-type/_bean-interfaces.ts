import { declareBeanInterface } from '@/util/beans';
import { L2Base, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2Argument } from './l2-argument';
import { L2Type } from './l2-type';
import { L2CallableType } from './l2-callable-type';

export interface L2ArgumentReader {
  read(c: L2ParseContext): ReadResult<L2Argument>;
  readList(c: L2ParseContext): L2Argument[];
}

export const l2ArgumentReader = declareBeanInterface<L2ArgumentReader>('L2ArgumentReader');

export interface L2CallableTypeReader {
  read(c: L2ParseContext): ReadResult<L2CallableType>;
}

export const l2CallableTypeReader = declareBeanInterface<L2CallableTypeReader>('L2CallableTypeReader');

export interface L2TypeItemReader {
  read(c: L2ParseContext): ReadResult<L2Type>;
}

export const l2TypeItemReader = declareBeanInterface<L2TypeItemReader>('L2TypeItemReader');

export interface L2TypeReader {
  read(c: L2ParseContext): ReadResult<L2Type>;
}

export const l2TypeReader = declareBeanInterface<L2TypeReader>('L2TypeReader');
