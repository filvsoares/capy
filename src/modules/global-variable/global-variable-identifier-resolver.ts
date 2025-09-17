import { Invalid } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { ExpressionReaderContext } from '@/modules/expression/expression-reader';
import { IdentifierResolver } from '@/modules/expression/identifier-resolver';
import { GlobalVariable } from '@/modules/global-variable/global-variable';
import { GlobalVariableReference } from '@/modules/global-variable/global-variable-reference';
import { Parser } from '@/modules/parser/parser';
import { Identifier } from '@/modules/tokenizer/identifier';
import { Bean } from '@/util/beans';

export class GlobalVariableIdentifierResolver extends Bean implements IdentifierResolver {
  constructor(private parser: Parser) {
    super();
  }

  resolveIdentifier(c: ExpressionReaderContext, name: string, origin: Identifier): Expression | Invalid | undefined {
    const symbol = c.parserData.findSymbol(c.currentModule, name);
    if (symbol instanceof GlobalVariable) {
      return new GlobalVariableReference(symbol.module, symbol.name, symbol.type, origin.pos);
    }
  }
}
