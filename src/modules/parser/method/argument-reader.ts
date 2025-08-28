import { Invalid } from '@/base';
import { Argument } from '@/modules/parser/method/argument';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { declareBeanInterface } from '@/util/beans';

export interface ArgumentReader {
  read(c: ParserContext): Argument | Invalid | undefined;
  readList(c: ParserContext): Argument[];
}

export const argumentReader = declareBeanInterface<ArgumentReader>('ArgumentReader');
