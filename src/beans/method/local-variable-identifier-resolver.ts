import { Invalid } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { ExpressionContext } from '@/beans/expression/expression-reader';
import { IdentifierResolver } from '@/beans/expression/identifier-resolver';
import { LocalVariableReference } from '@/beans/method/local-variable-reference';
import { MethodStack } from '@/beans/method/method-stack';
import { Parser } from '@/beans/parser/parser';
import { ParserContext } from '@/beans/parser/parser-context';
import { Identifier } from '@/beans/tokenizer/identifier';
import { Bean } from '@/util/beans';

export class LocalVariableIdentifierResolver extends Bean implements IdentifierResolver {
  constructor(private parser: Parser) {
    super();
  }

  resolveIdentifier(
    c: ParserContext,
    obj: Identifier,
    context: ExpressionContext | null
  ): Expression | Invalid | undefined {
    if (!(context instanceof MethodStack)) {
      return;
    }
    const index = context.find(obj);
    if (index !== undefined) {
      const dep = context.items[index];
      return new LocalVariableReference(index, dep.name, dep.type, obj.pos);
    }
  }
}
