import { Invalid } from '@/base';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { declareBeanInterface } from '@/util/beans';
import { Type } from './type';

export interface TypeReader {
  read(c: ParserContext): Type | Invalid | undefined;
  isAssignable(type: Type, assignTo: Type): boolean;
}

export const typeReader = declareBeanInterface<TypeReader>('TypeReader');
