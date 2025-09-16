import { Invalid } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { ExpressionReaderContext } from '@/modules/expression/expression-reader';
import { IdentifierResolver } from '@/modules/expression/identifier-resolver';
import { LocalVariableReference } from '@/modules/method/local-variable-reference';
import { methodData } from '@/modules/method/method-data';
import { Parser } from '@/modules/parser/parser';
import { Identifier } from '@/modules/tokenizer/identifier';
import { Bean } from '@/util/beans';

export class LocalVariableIdentifierResolver extends Bean implements IdentifierResolver {
  priority = 1000;

  constructor(private parser: Parser) {
    super();
  }

  resolveIdentifier(c: ExpressionReaderContext, obj: Identifier): Expression | Invalid | undefined {
    const md = methodData.optionalFrom(c);
    if (!md) {
      return;
    }
    const index = md.find(obj);
    if (index !== undefined) {
      const dep = md.items[index];
      return new LocalVariableReference(index, dep.name, dep.type, obj.pos);
    }
  }
}
