import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { Expression } from '@/modules/parser/expression/expression';
import { GlobalVariableReference } from '@/modules/parser/global-variable/global-variable-reference';
import { Bean } from '@/util/beans';

export class GlobalVariableReferenceProcessor extends Bean implements ExpressionItemProcessor {
  processExpression(c: CodegenContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof GlobalVariableReference)) {
      return;
    }
    return [obj.name];
  }
}
