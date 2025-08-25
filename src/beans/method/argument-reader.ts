import { Invalid } from '@/base';
import { Argument } from '@/beans/method/argument';
import { ParserContext } from '@/beans/parser/parser';
import { declareBeanInterface } from '@/util/beans';

export interface ArgumentReader {
  read(c: ParserContext): Argument | Invalid | undefined;
  readList(c: ParserContext): Argument[];
}

export const argumentReader = declareBeanInterface<ArgumentReader>('ArgumentReader');
