import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { ExpressionProcessor } from '@/modules/codegen/expression/expression-processor';
import { Expression } from '@/modules/parser/expression/expression';
import { MethodCall } from '@/modules/parser/method/method-call';
import { Bean } from '@/util/beans';

export class MethodCallProcessor extends Bean implements ExpressionItemProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processExpression(c: CodegenContext, obj: Expression): string[] | undefined {
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
