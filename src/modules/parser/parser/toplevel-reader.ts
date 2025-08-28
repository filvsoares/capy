import { Invalid } from '@/base';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Symbol } from '@/modules/parser/parser/symbol';
import { declareBeanInterface } from '@/util/beans';

export interface ToplevelReader {
  read(c: ParserContext): Symbol | true | Invalid | undefined;
}

export const toplevelReader = declareBeanInterface<ToplevelReader>('ToplevelReader');
