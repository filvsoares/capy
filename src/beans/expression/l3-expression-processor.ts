import { L3Expression } from '@/beans/expression/l3-expression';
import { Invalid } from '@/beans/l3-parser/l3-base';
import { declareBeanInterface } from '@/util/beans';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L2Expression } from './l2-expression';

export interface L3ExpressionContext {}

export interface L3ExpressionProcessor {
  processExpression(c: L3ParseContext, src: L2Expression, context: L3ExpressionContext | null): L3Expression | Invalid;
  readReference(c: L3ParseContext, obj: L3Expression | Invalid): L3Expression | Invalid;
}

export const l3ExpressionProcessor = declareBeanInterface<L3ExpressionProcessor>('L3ExpressionProcessor');
