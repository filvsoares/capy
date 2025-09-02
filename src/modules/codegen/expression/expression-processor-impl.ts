import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { ExpressionProcessor } from '@/modules/codegen/expression/expression-processor';
import { Expression } from '@/modules/parser/expression/expression';
import { Bean } from '@/util/beans';

export class ExpressionProcessorImpl extends Bean implements ExpressionProcessor {
  constructor(private expressionItemProcessors: ExpressionItemProcessor[]) {
    super();
  }

  processExpression(c: CodegenContext, obj: Expression): string[] {
    for (const processor of this.expressionItemProcessors) {
      const result = processor.processExpression(c, obj);
      if (result) {
        return result;
      }
    }
    throw new Error(`No expressionItemProcessor for ${obj.constructor.name}`);
  }
}
