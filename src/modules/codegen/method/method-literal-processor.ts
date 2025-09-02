import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { ExpressionProcessorContext } from '@/modules/codegen/expression/expression-processor';
import { Expression } from '@/modules/parser/expression/expression';
import { MethodLiteral } from '@/modules/parser/method/method-literal';
import { Bean } from '@/util/beans';

export class MethodLiteralProcessor extends Bean implements ExpressionItemProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof MethodLiteral)) {
      return;
    }
    return [c.codegenData.getSymbolJsName(obj.module, obj.name)];
  }
}
