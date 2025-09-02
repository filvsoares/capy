import { Invalid } from '@/base';
import { Argument } from '@/modules/parser/method/argument';
import { CurrentModule } from '@/modules/parser/parser/current-module';
import { ParserData } from '@/modules/parser/parser/parser-data';
import { TokenReader } from '@/modules/parser/parser/token-reader';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';
import { ParseErrors } from '@/util/parse-errors';

export type ArgumentReaderContext = Context<ParserData & TokenReader & ParseErrors & CurrentModule>;

export interface ArgumentReader {
  read(c: ArgumentReaderContext): Argument | Invalid | undefined;
  readList(c: ArgumentReaderContext): Argument[];
}

export const argumentReader = declareBeanInterface<ArgumentReader>('ArgumentReader');
