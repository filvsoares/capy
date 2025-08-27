import { Invalid } from '@/base';
import { ParserContext } from '@/beans/parser/parser-context';
import { declareBeanInterface } from '@/util/beans';
import { CallableType } from './callable-type';

export interface CallableTypeReader {
  read(c: ParserContext): CallableType | Invalid | undefined;
}

export const callableTypeReader = declareBeanInterface<CallableTypeReader>('CallableTypeReader');
