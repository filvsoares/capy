import { Invalid } from '@/base';
import { ParserContext } from '@/beans/parser/parser-context';
import { Statement } from '@/beans/statement/statement';
import { StatementContext } from '@/beans/statement/statement-context';
import { declareBeanInterface } from '@/util/beans';
import { StatementList } from './statement-list';

export interface StatementReader {
  read(c: ParserContext, context: StatementContext): Statement | Invalid | undefined;
  readList(c: ParserContext, context: StatementContext): StatementList;
}

export const statementReader = declareBeanInterface<StatementReader>('StatementReader');
