import { Expression } from '@/modules/expression/expression';
import { ExpressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { ExpressionProcessor, ExpressionProcessorContext } from '@/modules/expression/expression-processor';
import { StringConcat } from '@/modules/operation/string-concat';
import { Bean } from '@/util/beans';

export class StringConcatProcessor extends Bean implements ExpressionItemProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof StringConcat)) {
      return;
    }
    return [
      ...this.expressionProcessor.processExpression(c, obj.operand),
      ' + ',
      ...this.expressionProcessor.processExpression(c, obj.other),
    ];
  }
}
