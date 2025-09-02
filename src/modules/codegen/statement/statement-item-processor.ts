import { CodegenData } from '@/modules/codegen/codegen/codegen-data';
import { CodegenWriter } from '@/modules/codegen/codegen/codegen-writer';
import { Statement } from '@/modules/parser/statement/statement';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';

export interface StatementItemProcessor {
  processStatement(c: Context<CodegenWriter & CodegenData>, obj: Statement, indent: string): boolean | undefined;
}

export const statementItemProcessor = declareBeanInterface<StatementItemProcessor>('StatementItemProcessor');
