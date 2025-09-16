import { Invalid, ParseError } from '@/base';
import { Application } from '@/modules/parser/application';
import { ModuleInput } from '@/modules/parser/module-input';
import { ParserData } from '@/modules/parser/parser-data';
import { Symbol } from '@/modules/parser/symbol';
import { ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { declareBeanInterface } from '@/util/beans';
import { ParseErrors } from '@/util/parse-errors';

export type ParserContext = {
  parserData: ParserData;
  parseErrors: ParseErrors;
};

export type ParserResult = {
  application: Application;
  errors: ParseError[];
};

export interface Parser {
  parse(inputs: ModuleInput[]): Promise<ParserResult>;
  readToplevel(c: ToplevelReaderContext): Promise<Symbol | true | Invalid | undefined>;
}

export const parser = declareBeanInterface<Parser>('Parser');
