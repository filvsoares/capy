import { Expression } from '@/modules/expression/expression';
import { ExpressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { ExpressionProcessorContext } from '@/modules/expression/expression-processor';
import { MethodLiteral } from '@/modules/method/method-literal';
import { Bean } from '@/util/beans';

export class MethodLiteralProcessor extends Bean implements ExpressionItemProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof MethodLiteral)) {
      return;
    }
    return [c.codegenData.getSymbolJsName(obj.module, obj.name)];
  }
}
