import { Invalid } from '@/base';
import { CurrentModule } from '@/modules/parser/parser/current-module';
import { ParserData } from '@/modules/parser/parser/parser-data';
import { TokenReader } from '@/modules/parser/parser/token-reader';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';
import { ParseErrors } from '@/util/parse-errors';
import { Type } from './type';

export type TypeReaderContext = Context<ParserData & TokenReader & ParseErrors & CurrentModule>;

export interface TypeReader {
  read(c: TypeReaderContext): Type | Invalid | undefined;
  isAssignable(type: Type, assignTo: Type): boolean;
}

export const typeReader = declareBeanInterface<TypeReader>('TypeReader');
