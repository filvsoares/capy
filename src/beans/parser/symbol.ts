import { Pos } from '@/base';
import { Toplevel } from '@/beans/parser/toplevel';

export abstract class Symbol extends Toplevel {
  constructor(public module: string, public name: string, pos: Pos) {
    super(pos);
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  module: ${this.module}\n`);
    out.push(`${prefix}  name: ${this.name}\n`);
  }
}
