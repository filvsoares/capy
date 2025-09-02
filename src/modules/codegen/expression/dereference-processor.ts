import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { ExpressionProcessor } from '@/modules/codegen/expression/expression-processor';
import { Dereference } from '@/modules/parser/expression/dereference';
import { Expression } from '@/modules/parser/expression/expression';
import { Bean } from '@/util/beans';

export class DereferenceProcessor extends Bean implements ExpressionItemProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processExpression(c: CodegenContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof Dereference)) {
      return;
    }
    return [...this.expressionProcessor.processExpression(c, obj.operand)];
  }
}
