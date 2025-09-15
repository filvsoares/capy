import { Invalid } from '@/base';
import { CurrentModule } from '@/modules/parser/parser/current-module';
import { ParserData } from '@/modules/parser/parser/parser-data';
import { Symbol } from '@/modules/parser/parser/symbol';
import { TokenReader } from '@/modules/parser/parser/token-reader';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';
import { ParseErrors } from '@/util/parse-errors';

export type ToplevelReaderContext = Context<ParserData & TokenReader & ParseErrors & CurrentModule>;

export interface ToplevelReader {
  read(c: ToplevelReaderContext): Promise<Symbol | true | Invalid | undefined>;
}

export const toplevelReader = declareBeanInterface<ToplevelReader>('ToplevelReader');
