import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { Statement } from '@/modules/parser/statement/statement';
import { declareBeanInterface } from '@/util/beans';

export interface StatementItemProcessor {
  processStatement(c: CodegenContext, obj: Statement, indent: string): boolean | undefined;
}

export const statementItemProcessor = declareBeanInterface<StatementItemProcessor>('StatementItemProcessor');
