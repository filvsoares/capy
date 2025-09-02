import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { ExpressionProcessor, ExpressionProcessorContext } from '@/modules/codegen/expression/expression-processor';
import { Expression } from '@/modules/parser/expression/expression';
import { StringConcat } from '@/modules/parser/operation/string-concat';
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
