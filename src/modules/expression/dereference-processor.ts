import { dereference } from '@/modules/expression/cg-dereference';
import { Dereference } from '@/modules/expression/dereference';

import { Expression } from '@/modules/expression/expression';
import { ExpressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { ExpressionProcessor, ExpressionProcessorContext } from '@/modules/expression/expression-processor';
import { Bean } from '@/util/beans';

export class DereferenceProcessor extends Bean implements ExpressionItemProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof Dereference)) {
      return;
    }
    return [...this.expressionProcessor.processExpression({ ...c, ...dereference.wrap(true) }, obj.operand)];
  }
}
