import { Invalid } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { IdentifierResolver } from '@/modules/parser/expression/identifier-resolver';
import { Method } from '@/modules/parser/method/method';
import { MethodLiteral } from '@/modules/parser/method/method-literal';
import { Parser } from '@/modules/parser/parser/parser';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
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
