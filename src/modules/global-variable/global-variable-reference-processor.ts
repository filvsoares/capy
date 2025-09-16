import { dereference } from '@/modules/expression/cg-dereference';
import { Expression } from '@/modules/expression/expression';
import { ExpressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { ExpressionProcessorContext } from '@/modules/expression/expression-processor';
import { GlobalVariableReference } from '@/modules/global-variable/global-variable-reference';
import { Bean } from '@/util/beans';

export class GlobalVariableReferenceProcessor extends Bean implements ExpressionItemProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof GlobalVariableReference)) {
      return;
    }
    if (dereference.optionalFrom(c)) {
      return [`${c.codegenData.getSymbolJsName(obj.module, obj.name)}get()`];
    }
    return [c.codegenData.getSymbolJsName(obj.module, obj.name)];
  }
}
