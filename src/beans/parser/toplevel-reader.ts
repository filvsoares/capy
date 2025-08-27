import { Invalid } from '@/base';
import { ParserContext } from '@/beans/parser/parser-context';
import { Symbol } from '@/beans/parser/symbol';
import { declareBeanInterface } from '@/util/beans';

export interface ToplevelReader {
  read(c: ParserContext): Symbol | true | Invalid | undefined;
}

export const toplevelReader = declareBeanInterface<ToplevelReader>('ToplevelReader');
