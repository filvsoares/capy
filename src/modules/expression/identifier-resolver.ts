import { Invalid } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { ExpressionReaderContext } from '@/modules/expression/expression-reader';
import { Identifier } from '@/modules/tokenizer/identifier';
import { declareBeanInterface } from '@/util/beans';

export interface IdentifierResolver {
  resolveIdentifier(c: ExpressionReaderContext, obj: Identifier): Expression | Invalid | undefined;
}

export const identifierResolver = declareBeanInterface<IdentifierResolver>('IdentifierResolver');
