import { CodegenContext } from '@/modules/codegen/codegen';
import { StatementItemProcessor } from '@/modules/statement/statement-item-processor';
import { StatementList } from '@/modules/statement/statement-list';
import { StatementProcessor } from '@/modules/statement/statement-processor';
import { Bean } from '@/util/beans';

export class StatementProcessorImpl extends Bean implements StatementProcessor {
  constructor(private statementItemProcessors: StatementItemProcessor[]) {
    super();
  }

  processStatementList(c: CodegenContext, obj: StatementList, indent: string): void {
    loop: for (const statement of obj.list) {
      let ok = false;
      for (const processor of this.statementItemProcessors) {
        if (processor.processStatement(c, statement, indent)) {
          ok = true;
          continue loop;
        }
      }
      if (!ok) {
        throw new Error(`No statement processor for ${statement.constructor.name}`);
      }
    }
  }
}
