import { ParserContext } from '@/beans/parser/parser';
import { Toplevel } from '@/beans/parser/toplevel';
import { declareBeanInterface } from '@/util/beans';

export interface ToplevelReader {
  read(c: ParserContext): Toplevel;
}

export const toplevelReader = declareBeanInterface<ToplevelReader>('ToplevelReader');
