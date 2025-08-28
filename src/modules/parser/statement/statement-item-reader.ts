import { Invalid } from '@/base';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Statement } from '@/modules/parser/statement/statement';
import { StatementContext } from '@/modules/parser/statement/statement-context';
import { declareBeanInterface } from '@/util/beans';

export interface StatementItemReader {
  read(c: ParserContext, context: StatementContext): Statement | Invalid | undefined;
}

export const statementItemReader = declareBeanInterface<StatementItemReader>('StatementItemReader');
