import { Invalid } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { ExpressionContext } from '@/modules/parser/expression/expression-reader';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { declareBeanInterface } from '@/util/beans';

export interface IdentifierResolver {
  resolveIdentifier(
    c: ParserContext,
    obj: Identifier,
    context: ExpressionContext | null
  ): Expression | Invalid | undefined;
}

export const identifierResolver = declareBeanInterface<IdentifierResolver>('IdentifierResolver');
