import { ParseError } from '@/base';
import { ParserContext } from '@/beans/parser/parser-context';
import { Symbol } from '@/beans/parser/symbol';
import { declareBeanInterface } from '@/util/beans';

export type ParserResult = {
  modules: { [moduleName: string]: { [symbolName: string]: Symbol } };
  errors: ParseError[];
};

export interface Parser {
  parse(modules: { [name: string]: string }): ParserResult;
  findSymbol(c: ParserContext, symbolName: string): Symbol | undefined;
}

export const parser = declareBeanInterface<Parser>('Parser');
