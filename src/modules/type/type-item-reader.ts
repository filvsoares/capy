import { Invalid } from '@/base';
import { TypeReaderContext } from '@/modules/type/type-reader';
import { declareBeanInterface } from '@/util/beans';
import { Type } from './type';

export interface TypeItemReader {
  read(c: TypeReaderContext): Type | Invalid | undefined;
  isAssignable(type: Type, assignTo: Type): boolean | undefined;
}

export const typeItemReader = declareBeanInterface<TypeItemReader>('TypeItemReader');
