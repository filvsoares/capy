import { ParseError } from '@/base';
import { Token } from '@/beans/parser/token';
import { Toplevel } from '@/beans/parser/toplevel';
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
}

export type ParserResult = {
  list: Toplevel[];
  errors: ParseError[];
};

export interface Parser {
  readToken(c: TokenizerContext): Token | true | undefined;
  parse(s: string): ParserResult;
}

export const parser = declareBeanInterface<Parser>('Parser');
