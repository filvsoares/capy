import { Invalid } from '@/base';
import { CurrentModule } from '@/modules/parser/parser/current-module';
import { ParserData } from '@/modules/parser/parser/parser-data';
import { TokenReader } from '@/modules/parser/parser/token-reader';
import { Statement } from '@/modules/parser/statement/statement';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';
import { ParseErrors } from '@/util/parse-errors';
import { StatementList } from './statement-list';

export type StatementReaderContext = Context<ParserData & ParseErrors & TokenReader & CurrentModule>;

export interface StatementReader {
  read(c: StatementReaderContext): Statement | Invalid | undefined;
  readList(c: StatementReaderContext): StatementList;
}

export const statementReader = declareBeanInterface<StatementReader>('StatementReader');
