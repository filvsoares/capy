import { Pos } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { Type } from '@/beans/type/type';

export class GlobalVariableReference extends Expression {
  module: string;
  name: string;

  constructor(module: string, name: string, type: Type, pos: Pos) {
    super(type, pos);
    this.module = module;
    this.name = name;
  }

  get isReference(): boolean {
    return true;
  }

  toString(): string {
    return `identifier "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  module: ${this.module}\n`);
    out.push(`${prefix}  name: ${this.name}\n`);
  }
}
