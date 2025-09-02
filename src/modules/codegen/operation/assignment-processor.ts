import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { ExpressionProcessor, ExpressionProcessorContext } from '@/modules/codegen/expression/expression-processor';
import { Expression } from '@/modules/parser/expression/expression';
import { Assignment } from '@/modules/parser/operation/assignment';
import { Bean } from '@/util/beans';

export class AssignmentProcessor extends Bean implements ExpressionItemProcessor {
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
