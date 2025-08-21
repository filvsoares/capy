import { declareBeanInterface } from '@/util/beans';
import { L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L2CallableType } from './l2-callable-type';

export interface L2CallableTypeReader {
  read(c: L2ParseContext): ReadResult<L2CallableType>;
}

export const l2CallableTypeReader = declareBeanInterface<L2CallableTypeReader>('L2CallableTypeReader');
