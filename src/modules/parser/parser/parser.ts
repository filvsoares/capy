import { Invalid, ParseError } from '@/base';
import { Application } from '@/modules/parser/parser/application';
import { ModuleInput } from '@/modules/parser/parser/module-input';
import { Symbol } from '@/modules/parser/parser/symbol';
import { ToplevelReaderContext } from '@/modules/parser/parser/toplevel-reader';
import { declareBeanInterface } from '@/util/beans';

export type ParserResult = {
  application: Application;
  errors: ParseError[];
};

export interface Parser {
  parse(inputs: ModuleInput[]): Promise<ParserResult>;
  readToplevel(c: ToplevelReaderContext): Promise<Symbol | true | Invalid | undefined>;
}

export const parser = declareBeanInterface<Parser>('Parser');
