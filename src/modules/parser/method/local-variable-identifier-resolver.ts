import { Invalid } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { ExpressionContext } from '@/modules/parser/expression/expression-reader';
import { IdentifierResolver } from '@/modules/parser/expression/identifier-resolver';
import { LocalVariableReference } from '@/modules/parser/method/local-variable-reference';
import { MethodContext } from '@/modules/parser/method/method-context';
import { Parser } from '@/modules/parser/parser/parser';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { Bean } from '@/util/beans';

export class LocalVariableIdentifierResolver extends Bean implements IdentifierResolver {
  priority = 1000;

  constructor(private parser: Parser) {
    super();
  }

  resolveIdentifier(
    c: ParserContext,
    obj: Identifier,
    context: ExpressionContext | null
  ): Expression | Invalid | undefined {
    if (!(context instanceof MethodContext)) {
      return;
    }
    const index = context.find(obj);
    if (index !== undefined) {
      const dep = context.items[index];
      return new LocalVariableReference(index, dep.name, dep.type, obj.pos);
    }
  }
}
