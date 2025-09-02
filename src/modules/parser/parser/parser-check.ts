import { ParserData } from '@/modules/parser/parser/parser-data';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';
import { ParseErrors } from '@/util/parse-errors';

export interface ParserCheck {
  checkOutputs(c: Context<ParserData & ParseErrors>): void;
}

export const parserCheck = declareBeanInterface<ParserCheck>('ParserCheck');
