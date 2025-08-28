import { Pos } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { Type } from '@/beans/type/type';

export class LocalVariableReference extends Expression {
  index: number;
  name: string;

  constructor(index: number, name: string, type: Type, pos: Pos) {
    super(type, pos);
    this.index = index;
    this.name = name;
  }

  get isReference(): boolean {
    return true;
  }

  toString(): string {
    return `local variable "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  index: ${this.index}\n`);
  }
}
