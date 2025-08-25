import { Invalid } from '@/base';
import { ParserContext } from '@/beans/parser/parser';
import { declareBeanInterface } from '@/util/beans';

export interface ToplevelReader {
  read(c: ParserContext): true | Invalid | undefined;
}

export const toplevelReader = declareBeanInterface<ToplevelReader>('ToplevelReader');
