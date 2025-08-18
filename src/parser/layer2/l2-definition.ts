import { Pos } from '@/parser/base';
import { L2Type } from './l2-type';
import { L2Base } from './l2-types';

export abstract class L2Definition<T extends L2Type = L2Type> extends L2Base {
  type: T;
  name: string;

  constructor(name: string, type: T, pos: Pos) {
    super(pos);
    this.name = name;
    this.type = type;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}
