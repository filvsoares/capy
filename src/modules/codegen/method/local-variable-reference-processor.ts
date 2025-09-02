import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { ExpressionProcessorContext } from '@/modules/codegen/expression/expression-processor';
import { hasMethodData } from '@/modules/codegen/method/method-data';
import { Expression } from '@/modules/parser/expression/expression';
import { LocalVariableReference } from '@/modules/parser/method/local-variable-reference';
import { Bean } from '@/util/beans';

export class LocalVariableReferenceProcessor extends Bean implements ExpressionItemProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof LocalVariableReference) || !hasMethodData(c)) {
      return;
    }
    return [c.methodData.getJsName(obj)];
  }
}
