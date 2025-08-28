import { Base, INTERNAL } from '@/base';
import { Symbol } from '@/modules/parser/parser/symbol';

export class Module extends Base {
  constructor(public name: string, public symbols: { [symbolName: string]: Symbol }) {
    super(INTERNAL);
  }

  toString(): string {
    return 'module';
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
