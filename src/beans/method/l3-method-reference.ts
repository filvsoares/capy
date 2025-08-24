import { Pos } from '@/base';
import { L3Reference } from '@/beans/expression/l3-reference';
import { L3Type } from '@/beans/type/l3-type';

export class L3MethodReference extends L3Reference {
  module: string;
  name: string;

  get isReference(): boolean {
    return true;
  }

  constructor(module: string, name: string, type: L3Type, pos: Pos) {
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
