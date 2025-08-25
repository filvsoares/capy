import { Base, INTERNAL } from '@/base';
import { Symbol } from '@/beans/parser/symbol';

export class Module extends Base {
  name: string;
  symbols: Symbol[] = [];

  constructor(name: string, symbols: Symbol[]) {
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
