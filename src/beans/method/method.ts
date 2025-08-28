import { Pos } from '@/base';
import { CallableType } from '@/beans/method/callable-type';
import { Symbol } from '@/beans/parser/symbol';

export abstract class Method extends Symbol {
  constructor(module: string, name: string, public type: CallableType, pos: Pos) {
    super(module, name, pos);
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}
