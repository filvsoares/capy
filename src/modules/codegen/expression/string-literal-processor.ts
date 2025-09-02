import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { ExpressionProcessorContext } from '@/modules/codegen/expression/expression-processor';
import { Expression } from '@/modules/parser/expression/expression';
import { StringLiteral } from '@/modules/parser/expression/string-literal';
import { Bean } from '@/util/beans';

export class StringLiteralProcessor extends Bean implements ExpressionItemProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof StringLiteral)) {
      return;
    }
    return ['"', obj.value, '"'];
  }
}
