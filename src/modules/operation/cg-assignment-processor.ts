import { Expression } from '@/modules/expression/expression';
import { ExpressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { ExpressionProcessor, ExpressionProcessorContext } from '@/modules/expression/expression-processor';
import { Assignment } from '@/modules/operation/assignment';
import { Bean } from '@/util/beans';

export class CgAssignmentProcessor extends Bean implements ExpressionItemProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof Assignment)) {
      return;
    }
    return [
      ...this.expressionProcessor.processExpression(c, obj.target),
      ' = ',
      ...this.expressionProcessor.processExpression(c, obj.operand),
    ];
  }
}
