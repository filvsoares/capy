import { Pos } from '@/base';
import { VariableReference } from '@/beans/method/variable-reference';
import { Type } from '@/beans/type/type';

export class LocalVariableReference extends VariableReference {
  index: number;
  name: string;

  constructor(index: number, name: string, type: Type, pos: Pos) {
    super(type, pos);
    this.index = index;
    this.name = name;
  }

  toString(): string {
    return `identifier "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  index: ${this.index}\n`);
  }
}
