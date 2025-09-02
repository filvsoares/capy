import { Invalid } from '@/base';
import { TypeReaderContext } from '@/modules/parser/type/type-reader';
import { declareBeanInterface } from '@/util/beans';
import { CallableType } from './callable-type';

export interface CallableTypeReader {
  read(c: TypeReaderContext): CallableType | Invalid | undefined;
}

export const callableTypeReader = declareBeanInterface<CallableTypeReader>('CallableTypeReader');
