import { Invalid } from '@/base';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Statement } from '@/modules/parser/statement/statement';
import { StatementContext } from '@/modules/parser/statement/statement-context';
import { declareBeanInterface } from '@/util/beans';
import { StatementList } from './statement-list';

export interface StatementReader {
  read(c: ParserContext, context: StatementContext): Statement | Invalid | undefined;
  readList(c: ParserContext, context: StatementContext): StatementList;
}

export const statementReader = declareBeanInterface<StatementReader>('StatementReader');
