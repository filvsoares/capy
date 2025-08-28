import { Pos } from '@/base';
import { LocalVariable } from '@/modules/parser/method/local-variable';
import { Type } from '@/modules/parser/type/type';

export class ArgumentVariable extends LocalVariable {
  index: number;

  constructor(index: number, name: string, type: Type, pos: Pos) {
    super(name, type, pos);
    this.index = index;
  }

  toString(): string {
    return 'argument dependency';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  index: ${this.index}\n`);
  }
}
