import { Invalid } from '@/base';
import { Statement } from '@/modules/statement/statement';
import { StatementReaderContext } from '@/modules/statement/statement-reader';
import { declareBeanInterface } from '@/util/beans';

export interface StatementItemReader {
  read(c: StatementReaderContext): Statement | Invalid | undefined;
}

export const statementItemReader = declareBeanInterface<StatementItemReader>('StatementItemReader');
