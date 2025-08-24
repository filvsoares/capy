import { Base, INTERNAL, ParseError, Pos } from '@/base';
import { L2Base } from '@/beans/l2-parser/l2-base';
import { declareBeanInterface } from '@/util/beans';

export abstract class L3Base extends Base {
  isL3() {
    return true;
  }
}

export abstract class L3Symbol extends L3Base {
  name: string;

  constructor(name: string, pos: Pos) {
    super(pos);
    this.name = name;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
  }
}

export class L3Module extends L3Base {
  name: string;
  symbols: L3Symbol[] = [];

  constructor(name: string, symbols: L3Symbol[]) {
    super(INTERNAL);
    this.name = name;
    this.symbols = symbols;
  }

  toString(): string {
    return 'runnable';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  symbols:\n`);
    this.symbols.forEach((val) => {
      out.push(`${prefix}    - `);
      val?.debugPrint(out, `${prefix}      `);
    });
  }
}

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
