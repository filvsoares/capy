import { Pos } from '@/parser/base';
import { L2Base } from '../../l2-types';
import { L2Toplevel } from './l2-toplevel';

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
