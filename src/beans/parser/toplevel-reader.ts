import { Invalid } from '@/base';
import { ToplevelParserContext } from '@/beans/parser/parser';
import { declareBeanInterface } from '@/util/beans';

export interface ToplevelReader {
  read(c: ToplevelParserContext): true | Invalid | undefined;
}

export const toplevelReader = declareBeanInterface<ToplevelReader>('ToplevelReader');
