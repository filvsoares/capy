import { L3Expression } from '@/beans/expression/l3-expression';
import { L3ExpressionContext } from '@/beans/expression/l3-expression-processor';
import { Invalid } from '@/beans/l3-parser/l3-base';
import { declareBeanInterface } from '@/util/beans';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L2Identifier } from './l2-expression';
import { L3Reference } from './l3-reference';

export interface L3ReferenceProcessor {
  processReference(
    c: L3ParseContext,
    ref: L2Identifier,
    context: L3ExpressionContext | null
  ): L3Reference | Invalid | undefined;
  readReference(c: L3ParseContext, obj: L3Expression): L3Expression | Invalid | undefined;
}

export const l3ReferenceProcessor = declareBeanInterface<L3ReferenceProcessor>('L3ReferenceProcessor');
