import { Invalid } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { ExpressionReaderContext } from '@/modules/parser/expression/expression-reader';
import { IdentifierResolver } from '@/modules/parser/expression/identifier-resolver';
import { GlobalVariable } from '@/modules/parser/global-variable/global-variable';
import { GlobalVariableReference } from '@/modules/parser/global-variable/global-variable-reference';
import { Parser } from '@/modules/parser/parser/parser';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { Bean } from '@/util/beans';

export class GlobalVariableIdentifierResolver extends Bean implements IdentifierResolver {
  constructor(private parser: Parser) {
    super();
  }

  resolveIdentifier(c: ExpressionReaderContext, obj: Identifier): Expression | Invalid | undefined {
    const symbol = this.parser.findSymbol(c, obj.name);
    if (symbol instanceof GlobalVariable) {
      return new GlobalVariableReference(symbol.module, symbol.name, symbol.type, obj.pos);
    }
  }
}
