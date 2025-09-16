import { Invalid } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { ExpressionReaderContext } from '@/modules/expression/expression-reader';
import { IdentifierResolver } from '@/modules/expression/identifier-resolver';
import { Method } from '@/modules/method/method';
import { MethodLiteral } from '@/modules/method/method-literal';
import { Parser } from '@/modules/parser/parser';
import { Identifier } from '@/modules/tokenizer/identifier';
import { Bean } from '@/util/beans';

export class MethodIdentifierResolver extends Bean implements IdentifierResolver {
  constructor(private parser: Parser) {
    super();
  }

  resolveIdentifier(c: ExpressionReaderContext, obj: Identifier): Expression | Invalid | undefined {
    const symbol = c.parserData.findSymbol(c.currentModule, obj.name);
    if (symbol instanceof Method) {
      return new MethodLiteral(symbol.module, symbol.name, symbol.type, obj.pos);
    }
  }
}
