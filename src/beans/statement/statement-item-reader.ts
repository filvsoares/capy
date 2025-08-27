import { Invalid } from '@/base';
import { ParserContext } from '@/beans/parser/parser-context';
import { Statement } from '@/beans/statement/statement';
import { StatementContext } from '@/beans/statement/statement-context';
import { Type } from '@/beans/type/type';
import { declareBeanInterface } from '@/util/beans';

export interface StatementItemReader {
  read(c: ParserContext, context: StatementContext, expectedReturnType: Type): Statement | Invalid | undefined;
}

export const statementItemReader = declareBeanInterface<StatementItemReader>('StatementItemReader');
