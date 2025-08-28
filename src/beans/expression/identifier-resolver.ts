import { Invalid } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { ExpressionContext } from '@/beans/expression/expression-reader';
import { ParserContext } from '@/beans/parser/parser-context';
import { Identifier } from '@/beans/tokenizer/identifier';
import { declareBeanInterface } from '@/util/beans';

export interface IdentifierResolver {
  resolveIdentifier(
    c: ParserContext,
    obj: Identifier,
    context: ExpressionContext | null
  ): Expression | Invalid | undefined;
}

export const identifierResolver = declareBeanInterface<IdentifierResolver>('IdentifierResolver');
