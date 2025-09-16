import { Invalid } from '@/base';
import { ParserContext } from '@/modules/parser/parser';
import { Symbol } from '@/modules/parser/symbol';
import { TokenReader } from '@/modules/parser/token-reader';
import { declareBeanInterface } from '@/util/beans';

export type ToplevelReaderContext = ParserContext & {
  tokenReader: TokenReader;
  currentModule: string;
};

export interface ToplevelReader {
  read(c: ToplevelReaderContext): Promise<Symbol | true | Invalid | undefined>;
}

export const toplevelReader = declareBeanInterface<ToplevelReader>('ToplevelReader');
