import { Invalid } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { IdentifierResolver } from '@/beans/expression/identifier-resolver';
import { Method } from '@/beans/method/method';
import { MethodLiteral } from '@/beans/method/method-literal';
import { Parser } from '@/beans/parser/parser';
import { ParserContext } from '@/beans/parser/parser-context';
import { Identifier } from '@/beans/tokenizer/identifier';
import { Bean } from '@/util/beans';

export class MethodIdentifierResolver extends Bean implements IdentifierResolver {
  constructor(private parser: Parser) {
    super();
  }

  resolveIdentifier(c: ParserContext, obj: Identifier): Expression | Invalid | undefined {
    const symbol = this.parser.findSymbol(c, obj.name);
    if (symbol instanceof Method) {
      return new MethodLiteral(symbol.module, symbol.name, symbol.type, obj.pos);
    }
  }
}
