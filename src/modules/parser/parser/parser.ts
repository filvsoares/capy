import { ParseError } from '@/base';
import { Module } from '@/modules/parser/parser/module';
import { ModuleInput } from '@/modules/parser/parser/module-input';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Symbol } from '@/modules/parser/parser/symbol';
import { declareBeanInterface } from '@/util/beans';

export type ParserResult = {
  modules: { [moduleName: string]: Module };
  errors: ParseError[];
};

export interface Parser {
  parse(moduleInputs: { [moduleName: string]: ModuleInput }): ParserResult;
  findSymbol(c: ParserContext, symbolName: string): Symbol | undefined;
  replaceSymbol(c: ParserContext, newSymbol: Symbol): void;
  findModule(c: ParserContext, moduleName: string): Module | undefined;
}

export const parser = declareBeanInterface<Parser>('Parser');
