import { CodegenContext } from '@/modules/codegen/codegen';
import { StatementList } from '@/modules/statement/statement-list';
import { declareBeanInterface } from '@/util/beans';

export interface StatementProcessor {
  processStatementList(c: CodegenContext, obj: StatementList, indent: string): void;
}

export const statementProcessor = declareBeanInterface<StatementProcessor>('StatementProcessor');
