import { Pos } from '@/beans/base';
import { L2Base, L2Toplevel } from '../l2-parser/l2-types';

export class L2Use extends L2Toplevel {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `use "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}
