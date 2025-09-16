import { CodegenContext } from '@/modules/codegen/codegen';
import { ExpressionProcessor } from '@/modules/expression/expression-processor';
import { ReturnStatement } from '@/modules/method/return-statement';
import { Statement } from '@/modules/statement/statement';
import { StatementItemProcessor } from '@/modules/statement/statement-item-processor';
import { Bean } from '@/util/beans';

export class ReturnStatementProcessor extends Bean implements StatementItemProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processStatement(c: CodegenContext, obj: Statement, indent: string): boolean | undefined {
    if (!(obj instanceof ReturnStatement)) {
      return;
    }
    c.codegenWriter.write(indent, 'return');
    if (obj.expr) {
      c.codegenWriter.write(' ', ...this.expressionProcessor.processExpression(c, obj.expr));
    }
    c.codegenWriter.write(';\n');
    return true;
  }
}
