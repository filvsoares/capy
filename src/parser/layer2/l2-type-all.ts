import { readCallableType } from './l2-callable-type';
import { readSimpleType } from './l2-simple-type';
import { L2Type } from './l2-type';
import { L2ParseContext, ReadResult } from './l2-types';

export function readType(c: L2ParseContext): ReadResult<L2Type> {
  return readCallableType(c) || readSimpleType(c);
}
