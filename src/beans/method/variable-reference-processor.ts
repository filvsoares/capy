import { ERROR, INVALID, Invalid } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { ExpressionContext } from '@/beans/expression/expression-reader';
import { Reference } from '@/beans/expression/reference';
import { ReferenceProcessor } from '@/beans/expression/reference-processor';
import { GlobalVariable } from '@/beans/global-variable/global-variable';
import { GlobalVariableReference } from '@/beans/method/global-variable-reference';
import { LocalVariableReference } from '@/beans/method/local-variable-reference';
import { Method } from '@/beans/method/method';
import { MethodReference } from '@/beans/method/method-reference';
import { MethodStack } from '@/beans/method/method-stack';
import { ReadVariable } from '@/beans/method/read-variable';
import { Identifier } from '@/beans/parser/identifier';
import { ParserContext } from '@/beans/parser/parser';
import { Bean } from '@/util/beans';

export class VariableReferenceProcessor extends Bean implements ReferenceProcessor {
  processReference(
    c: ParserContext,
    ref: Identifier,
    context: ExpressionContext | null
  ): Reference | Invalid | undefined {
    if (!(context instanceof MethodStack)) {
      return;
    }
    if (context) {
      const index = context.find(ref);
      if (index !== undefined) {
        const dep = context.items[index];
        return new LocalVariableReference(index, dep.name, dep.type, ref.pos);
      }
    }
    const symbols = c.findSymbols(ref.name);
    if (symbols) {
      if (symbols.length > 1) {
        c.addError({
          level: ERROR,
          message: `Dependency ${ref.name} is ambiguous`,
          pos: ref.pos,
        });
        return INVALID;
      }
      const { module, symbol } = symbols[0];
      if (symbol instanceof Method) {
        return new MethodReference(module, symbol.name, symbol.type, ref.pos);
      }
      if (symbol instanceof GlobalVariable) {
        return new GlobalVariableReference(module, symbol.name, symbol.type, ref.pos);
      }
      throw new Error(`Unexpected symbol type ${symbol.constructor.name}`);
    }
  }

  readReference(c: ParserContext, obj: Expression): Expression | Invalid | undefined {
    if (obj instanceof MethodReference) {
      return obj;
    }
    if (obj instanceof GlobalVariableReference) {
      return new ReadVariable(obj, obj.type, obj.pos);
    }
  }
}
