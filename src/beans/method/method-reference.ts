import { Pos } from '@/base';
import { Reference } from '@/beans/expression/reference';
import { Type } from '@/beans/type/type';

export class MethodReference extends Reference {
  module: string;
  name: string;

  get isReference(): boolean {
    return true;
  }

  constructor(module: string, name: string, type: Type, pos: Pos) {
    super(type, pos);
    this.module = module;
    this.name = name;
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
