import { Invalid } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { ExpressionReaderContext } from '@/modules/parser/expression/expression-reader';
import { IdentifierResolver } from '@/modules/parser/expression/identifier-resolver';
import { LocalVariableReference } from '@/modules/parser/method/local-variable-reference';
import { hasMethodData } from '@/modules/parser/method/method-data';
import { Parser } from '@/modules/parser/parser/parser';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { Bean } from '@/util/beans';

export class LocalVariableIdentifierResolver extends Bean implements IdentifierResolver {
  priority = 1000;

  constructor(private parser: Parser) {
    super();
  }

  resolveIdentifier(c: ExpressionReaderContext, obj: Identifier): Expression | Invalid | undefined {
    if (!hasMethodData(c)) {
      return;
    }
    const index = c.methodData.find(obj);
    if (index !== undefined) {
      const dep = c.methodData.items[index];
      return new LocalVariableReference(index, dep.name, dep.type, obj.pos);
    }
  }
}
