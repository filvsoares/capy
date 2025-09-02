import { ParseError } from '@/base';
import { Application } from '@/modules/parser/parser/application';
import { ModuleInput } from '@/modules/parser/parser/module-input';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Symbol } from '@/modules/parser/parser/symbol';
import { declareBeanInterface } from '@/util/beans';

export type ParserResult = {
  application: Application;
  errors: ParseError[];
};

export interface Parser {
  parse(mainModuleName: string, inputs: ModuleInput[]): ParserResult;
  findSymbol(c: ParserContext, symbolName: string): Symbol | undefined;
  replaceSymbol(c: ParserContext, newSymbol: Symbol): void;
  findModule(c: ParserContext, moduleName: string): { [symbolName: string]: Symbol } | undefined;
}

export const parser = declareBeanInterface<Parser>('Parser');
