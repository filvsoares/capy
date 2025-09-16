import { Expression } from '@/modules/expression/expression';
import { ExpressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { ExpressionProcessor, ExpressionProcessorContext } from '@/modules/expression/expression-processor';
import { Bean } from '@/util/beans';

export class ExpressionProcessorImpl extends Bean implements ExpressionProcessor {
  constructor(private expressionItemProcessors: ExpressionItemProcessor[]) {
    super();
  }

  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] {
    for (const processor of this.expressionItemProcessors) {
      const result = processor.processExpression(c, obj);
      if (result) {
        return result;
      }
    }
    throw new Error(`No expressionItemProcessor for ${obj.constructor.name}`);
  }
}
