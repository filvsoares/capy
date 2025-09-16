import { Expression } from '@/modules/expression/expression';
import { ExpressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { ExpressionProcessor, ExpressionProcessorContext } from '@/modules/expression/expression-processor';
import { MethodCall } from '@/modules/method/method-call';
import { Bean } from '@/util/beans';

export class MethodCallProcessor extends Bean implements ExpressionItemProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof MethodCall)) {
      return;
    }
    const result = [...this.expressionProcessor.processExpression(c, obj.operand), '('];
    for (let i = 0; i < obj.argList.length; i++) {
      if (i > 0) {
        result.push(', ');
      }
      result.push(...this.expressionProcessor.processExpression(c, obj.argList[i]));
    }
    result.push(')');
    return result;
  }
}
