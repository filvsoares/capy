import { Invalid } from '@/base';
import { Argument } from '@/modules/method/argument';
import { ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { declareBeanInterface } from '@/util/beans';

export type ArgumentReaderContext = ToplevelReaderContext;

export interface ArgumentReader {
  read(c: ArgumentReaderContext): Argument | Invalid | undefined;
  readList(c: ArgumentReaderContext): Argument[];
}

export const argumentReader = declareBeanInterface<ArgumentReader>('ArgumentReader');
