import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { ExpressionProcessor } from '@/modules/codegen/expression/expression-processor';
import { StatementItemProcessor } from '@/modules/codegen/statement/statement-item-processor';
import { ExpressionStatement } from '@/modules/parser/statement/expression-statement';
import { Statement } from '@/modules/parser/statement/statement';
import { Bean } from '@/util/beans';

export class ExpressionStatementProcessor extends Bean implements StatementItemProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processStatement(c: CodegenContext, obj: Statement, indent: string): boolean | undefined {
    if (!(obj instanceof ExpressionStatement)) {
      return;
    }
    c.write(indent);
    c.write(...this.expressionProcessor.processExpression(c, obj.expr));
    c.write(';\n');
    return true;
  }
}
