import { Invalid } from '@/base';
import { ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { Statement } from '@/modules/statement/statement';
import { declareBeanInterface } from '@/util/beans';
import { StatementList } from './statement-list';

export type StatementReaderContext = ToplevelReaderContext;

export interface StatementReader {
  read(c: StatementReaderContext): Statement | Invalid | undefined;
  readList(c: StatementReaderContext): StatementList;
}

export const statementReader = declareBeanInterface<StatementReader>('StatementReader');
