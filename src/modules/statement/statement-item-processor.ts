import { CodegenContext } from '@/modules/codegen/codegen';
import { Statement } from '@/modules/statement/statement';
import { declareBeanInterface } from '@/util/beans';

export interface StatementItemProcessor {
  processStatement(c: CodegenContext, obj: Statement, indent: string): boolean | undefined;
}

export const statementItemProcessor = declareBeanInterface<StatementItemProcessor>('StatementItemProcessor');
