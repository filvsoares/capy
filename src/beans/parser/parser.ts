import { ParseError } from '@/base';
import { Module } from '@/beans/parser/module';
import { Symbol } from '@/beans/parser/symbol';
import { Token } from '@/beans/parser/token';
import { declareBeanInterface } from '@/util/beans';

export interface TokenizerContext {
  lin(): number;
  col(): number;
  current(): string;
  addError(e: ParseError): void;
  consume(): void;
}

export interface ParserContext {
  current(): Token | undefined;
  addError(e: ParseError): void;
  consume(): void;
  findSymbols(name: string): { module: string; symbol: Symbol }[] | undefined;
}

export interface ToplevelParserContext extends ParserContext {
  addToMySymbols(symbol: Symbol): boolean;
  addToAllSymbols(module: string, symbol: Symbol): void;
  getModule(name: string): Module | undefined;
}

export type ParserResult = {
  module: Module;
  errors: ParseError[];
};

export interface Parser {
  readToken(c: TokenizerContext): Token | true | undefined;
  parse(moduleName: string, s: string, modules: Module[]): ParserResult;
}

export const parser = declareBeanInterface<Parser>('Parser');
