import { ERROR } from '@/base';
import { L3Expression } from '@/beans/expression/l3-expression';
import { INVALID, Invalid } from '@/beans/l3-parser/l3-base';
import { L3MethodReference } from '@/beans/method/l3-method-reference';
import { Bean } from '@/util/beans';
import { L2Identifier } from '../expression/l2-expression';
import { L3ExpressionContext } from '../expression/l3-expression-processor';
import { L3Reference } from '../expression/l3-reference';
import { L3ReferenceProcessor } from '../expression/l3-reference-processor';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L3ReadVariable } from '../operation/l3-operation-processor';
import {
  L3LocalVariableReference,
  L3Method,
  L3ModuleVariableReference,
  L3Variable,
  L3VariableReference,
} from './l3-method';
import { MethodStack } from './l3-method-processor';

export class L3VariableReferenceProcessor extends Bean implements L3ReferenceProcessor {
  processReference(
    c: L3ParseContext,
    ref: L2Identifier,
    context: L3ExpressionContext | null
  ): L3Reference | Invalid | undefined {
    if (!(context instanceof MethodStack)) {
      return;
    }
    if (context) {
      const index = context.find(ref);
      if (index !== undefined) {
        const dep = context.items[index];
        return new L3LocalVariableReference(index, dep.name, dep.type, ref.pos);
      }
    }
    const symbols = c.allSymbols[ref.value];
    if (symbols) {
      if (symbols.length > 1) {
        c.errors.push({
          level: ERROR,
          message: `Dependency ${ref.value} is ambiguous`,
          pos: ref.pos,
        });
        return INVALID;
      }
      const { module, symbol } = symbols[0];
      if (symbol instanceof L3Method) {
        return new L3MethodReference(module, symbol.name, symbol.type, ref.pos);
      }
      if (symbol instanceof L3Variable) {
        return new L3ModuleVariableReference(module, symbol.name, symbol.type, ref.pos);
      }
      throw new Error(`Unexpected symbol type ${symbol.constructor.name}`);
    }
  }

  readReference(c: L3ParseContext, obj: L3Expression): L3Expression | Invalid | undefined {
    if (obj instanceof L3MethodReference) {
      return obj;
    }
    if (obj instanceof L3VariableReference) {
      return new L3ReadVariable(obj, obj.type, obj.pos);
    }
  }
}
