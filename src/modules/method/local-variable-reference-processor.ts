import { Expression } from '@/modules/expression/expression';
import { ExpressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { ExpressionProcessorContext } from '@/modules/expression/expression-processor';
import { methodData } from '@/modules/method/cg-method-data';
import { LocalVariableReference } from '@/modules/method/local-variable-reference';
import { Bean } from '@/util/beans';

export class LocalVariableReferenceProcessor extends Bean implements ExpressionItemProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof LocalVariableReference)) {
      return;
    }
    const _methodData = methodData.optionalFrom(c);
    if (!_methodData) {
      return;
    }

    return [_methodData.getJsName(obj)];
  }
}
