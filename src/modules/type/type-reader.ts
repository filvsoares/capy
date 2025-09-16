import { Invalid } from '@/base';
import { ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { declareBeanInterface } from '@/util/beans';
import { Type } from './type';

export type TypeReaderContext = ToplevelReaderContext;

export interface TypeReader {
  read(c: TypeReaderContext): Type | Invalid | undefined;
  isAssignable(type: Type, assignTo: Type): boolean;
}

export const typeReader = declareBeanInterface<TypeReader>('TypeReader');
