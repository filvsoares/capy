import { ParserData } from '@/modules/parser/parser/parser-data';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';
import { ParseErrors } from '@/util/parse-errors';

export interface ParserHook {
  onCreateContext?(c: Context<ParserData & ParseErrors>): Context<ParserData & ParseErrors>;
  onCheckOutputs?(c: Context<ParserData & ParseErrors>): void;
}

export const parserHook = declareBeanInterface<ParserHook>('ParserHook');
