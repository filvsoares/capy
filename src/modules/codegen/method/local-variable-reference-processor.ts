import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { Expression } from '@/modules/parser/expression/expression';
import { LocalVariableReference } from '@/modules/parser/method/local-variable-reference';
import { Bean } from '@/util/beans';

export class LocalVariableReferenceProcessor extends Bean implements ExpressionItemProcessor {
  processExpression(c: CodegenContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof LocalVariableReference)) {
      return;
    }
    return [obj.name];
  }
}
