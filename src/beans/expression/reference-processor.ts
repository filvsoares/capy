import { Invalid } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { ExpressionContext } from '@/beans/expression/expression-reader';
import { ParserContext } from '@/beans/parser/parser-context';
import { Identifier } from '@/beans/tokenizer/identifier';
import { declareBeanInterface } from '@/util/beans';
import { Reference } from './reference';

export interface ReferenceProcessor {
  processReference(
    c: ParserContext,
    ref: Identifier,
    context: ExpressionContext | null
  ): Reference | Invalid | undefined;
  readReference(c: ParserContext, obj: Expression): Expression | Invalid | undefined;
}

export const referenceProcessor = declareBeanInterface<ReferenceProcessor>('ReferenceProcessor');
