import { Codegen } from '@/modules/codegen/codegen/codegen';
import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { ExpressionItemProcessor } from '@/modules/codegen/expression/expression-item-processor';
import { Expression } from '@/modules/parser/expression/expression';
import { MethodLiteral } from '@/modules/parser/method/method-literal';
import { Bean } from '@/util/beans';

export class MethodLiteralProcessor extends Bean implements ExpressionItemProcessor {
  constructor(private codegen: Codegen) {
    super();
  }
  processExpression(c: CodegenContext, obj: Expression): string[] | undefined {
    if (!(obj instanceof MethodLiteral)) {
      return;
    }
    return [this.codegen.getSymbolJsName(c, obj.module, obj.name)];
  }
}
