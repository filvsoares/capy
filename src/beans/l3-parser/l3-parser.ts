import { declareBeanInterface } from '@/util/beans';
import { ParseError } from '../../base';
import { L2Base } from '../l2-parser/l2-base';
import { L3Module, L3Symbol } from '../type/l3-types';

export type L3ParseContext = {
  modules: { [name: string]: L3Module };
  errors: ParseError[];
  deferredTasks: (() => void)[];
  allSymbols: { [name: string]: { module: string; symbol: L3Symbol }[] };
  addToMySymbols(symbol: L3Symbol): boolean;
  addToAllSymbols(module: string, symbol: L3Symbol): void;
  replaceInMySymbols(symbol: L3Symbol): void;
};

export type L3ParseResult = {
  runnable: L3Module;
  errors: ParseError[];
};

export interface L3Parser {
  parse(moduleName: string, list: L2Base[], modules: L3Module[]): L3ParseResult;
}

export const l3Parser = declareBeanInterface<L3Parser>('L3Parser');
