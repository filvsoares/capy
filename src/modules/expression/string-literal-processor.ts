import { Expression } from '@/modules/expression/expression';
import { ExpressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { ExpressionProcessorContext } from '@/modules/expression/expression-processor';
import { StringLiteral } from '@/modules/expression/string-literal';
import { Bean } from '@/util/beans';

export class StringLiteralProcessor extends Bean implements ExpressionItemProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof StringLiteral)) {
      return;
    }
    return ['"', obj.value, '"'];
  }
}
