import { CodegenContext } from '@/modules/codegen/codegen';
import { ExpressionProcessor } from '@/modules/expression/expression-processor';
import { ExpressionStatement } from '@/modules/statement/expression-statement';
import { Statement } from '@/modules/statement/statement';
import { StatementItemProcessor } from '@/modules/statement/statement-item-processor';
import { Bean } from '@/util/beans';

export class ExpressionStatementProcessor extends Bean implements StatementItemProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processStatement(c: CodegenContext, obj: Statement, indent: string): boolean | undefined {
    if (!(obj instanceof ExpressionStatement)) {
      return;
    }
    c.codegenWriter.write(indent);
    c.codegenWriter.write(...this.expressionProcessor.processExpression(c, obj.expr));
    c.codegenWriter.write(';\n');
    return true;
  }
}
