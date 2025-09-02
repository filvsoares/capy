import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { ExpressionProcessor } from '@/modules/codegen/expression/expression-processor';
import { StatementItemProcessor } from '@/modules/codegen/statement/statement-item-processor';
import { ReturnStatement } from '@/modules/parser/method/return-statement';
import { Statement } from '@/modules/parser/statement/statement';
import { Bean } from '@/util/beans';

export class ReturnStatementProcessor extends Bean implements StatementItemProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processStatement(c: CodegenContext, obj: Statement, indent: string): boolean | undefined {
    if (!(obj instanceof ReturnStatement)) {
      return;
    }
    c.write(indent, 'return');
    if (obj.expr) {
      c.write(' ', ...this.expressionProcessor.processExpression(c, obj.expr));
    }
    c.write(';\n');
    return true;
  }
}
