import { hasDereference } from '@/modules/codegen/expression/dereference';
import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { ExpressionProcessorContext } from '@/modules/codegen/expression/expression-processor';
import { Expression } from '@/modules/parser/expression/expression';
import { GlobalVariableReference } from '@/modules/parser/global-variable/global-variable-reference';
import { Bean } from '@/util/beans';

export class GlobalVariableReferenceProcessor extends Bean implements ExpressionItemProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof GlobalVariableReference)) {
      return;
    }
    if (hasDereference(c)) {
      return [`${c.codegenData.getSymbolJsName(obj.module, obj.name)}get()`];
    }
    return [c.codegenData.getSymbolJsName(obj.module, obj.name)];
  }
}
