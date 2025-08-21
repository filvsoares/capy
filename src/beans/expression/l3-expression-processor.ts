import { declareBeanInterface } from '@/util/beans';
import { MethodStack } from '../definition/l3-method-processor';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { Invalid, L3Expression } from '../type/l3-types';
import { L2Expression } from './l2-expression';

export interface L3ExpressionProcessor {
  processExpression(c: L3ParseContext, src: L2Expression, stack: MethodStack | null): L3Expression | Invalid;
  readVariable(obj: L3Expression | Invalid): L3Expression | Invalid;
}

export const l3ExpressionProcessor = declareBeanInterface<L3ExpressionProcessor>('L3ExpressionProcessor');
