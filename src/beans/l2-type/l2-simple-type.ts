import { Pos } from '@/base';
import { L2Type } from './l2-type';

export class L2SimpleType extends L2Type {
  name: string;

  constructor(name: string, pos: Pos) {
    super(pos);
    this.name = name;
  }

  toString(): string {
    return `type ${this.name}`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
  }
}
