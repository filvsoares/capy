import { ParseError } from '@/base';
import { L1Base } from '@/beans/l1-parser/l1-base';
import { declareBeanInterface } from '@/util/beans';

export interface L1ParserContext {
  lin: number;
  col: number;
  current: string;
  errors: ParseError[];
  consume(): void;
}

export type L1ParserResult = {
  list: L1Base[];
  errors: ParseError[];
};

export interface L1Parser {
  read(c: L1ParserContext): L1Base | true | undefined;
  parse(s: string): L1ParserResult;
}

export const l1Parser = declareBeanInterface<L1Parser>('L1Parser');
