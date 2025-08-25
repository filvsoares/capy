import { Base, Pos } from '@/base';
import { Type } from '@/beans/type/type';

export class LocalVariable extends Base {
  name: string;
  type: Type;

  constructor(name: string, type: Type, pos: Pos) {
    super(pos);
    this.name = name;
    this.type = type;
  }

  toString(): string {
    return 'local var';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}
