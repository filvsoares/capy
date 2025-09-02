import { CodegenData } from '@/modules/codegen/codegen/codegen-data';
import { CodegenWriter } from '@/modules/codegen/codegen/codegen-writer';
import { StatementList } from '@/modules/parser/statement/statement-list';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';

export interface StatementProcessor {
  processStatementList(c: Context<CodegenWriter & CodegenData>, obj: StatementList, indent: string): void;
}

export const statementProcessor = declareBeanInterface<StatementProcessor>('StatementProcessor');
