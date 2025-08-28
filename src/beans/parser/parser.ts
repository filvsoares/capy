import { ParseError } from '@/base';
import { Module } from '@/beans/parser/module';
import { ModuleInput } from '@/beans/parser/module-input';
import { ParserContext } from '@/beans/parser/parser-context';
import { Symbol } from '@/beans/parser/symbol';
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
