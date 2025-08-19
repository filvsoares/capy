import { declareBeanInterface } from '@/util/beans';
import { L2Base, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2Argument } from './l2-argument';
import { L2Type } from './l2-type';
import { L2CallableType } from './l2-callable-type';

export interface L2TypeReader {
  read(c: L2ParseContext): ReadResult<L2Type>;
}

export const l2TypeReader = declareBeanInterface<L2TypeReader>('L2TypeReader');
