import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { StatementList } from '@/modules/parser/statement/statement-list';
import { declareBeanInterface } from '@/util/beans';

export interface StatementProcessor {
  processStatementList(c: CodegenContext, obj: StatementList, indent: string): void;
}

export const statementProcessor = declareBeanInterface<StatementProcessor>('StatementProcessor');
