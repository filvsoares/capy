import { Base, INTERNAL } from '@/base';
import { Symbol } from '@/modules/parser/parser/symbol';

export class Application extends Base {
  constructor(public mainModuleName: string, public symbols: Symbol[]) {
    super(INTERNAL);
  }

  toString(): string {
    return 'application';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  symbols:\n`);
    Object.values(this.symbols).forEach((val) => {
      out.push(`${prefix}    - `);
      val?.debugPrint(out, `${prefix}      `);
    });
  }
}
