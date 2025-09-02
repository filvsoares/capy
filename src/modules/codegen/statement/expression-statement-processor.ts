import { CodegenData } from '@/modules/codegen/codegen/codegen-data';
import { CodegenWriter } from '@/modules/codegen/codegen/codegen-writer';
import { ExpressionProcessor } from '@/modules/codegen/expression/expression-processor';
import { StatementItemProcessor } from '@/modules/codegen/statement/statement-item-processor';
import { ExpressionStatement } from '@/modules/parser/statement/expression-statement';
import { Statement } from '@/modules/parser/statement/statement';
import { Bean } from '@/util/beans';
import { Context } from '@/util/context';

export class ExpressionStatementProcessor extends Bean implements StatementItemProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processStatement(c: Context<CodegenWriter & CodegenData>, obj: Statement, indent: string): boolean | undefined {
    if (!(obj instanceof ExpressionStatement)) {
      return;
    }
    c.codegenWriter.write(indent);
    c.codegenWriter.write(...this.expressionProcessor.processExpression(c, obj.expr));
    c.codegenWriter.write(';\n');
    return true;
  }
}
