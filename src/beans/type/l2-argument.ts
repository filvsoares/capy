import { Pos } from '@/base';

import { L2Base } from '../l2-parser/l2-base';
import { L2Type } from './l2-type';

export class L2Argument extends L2Base {
  name: string;
  type: L2Type;

  constructor(name: string, type: L2Type, pos: Pos) {
    super(pos);
    this.name = name;
    this.type = type;
  }

  toString(): string {
    return 'argument';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}
