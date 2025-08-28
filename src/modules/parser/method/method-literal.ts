import { Pos } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { Type } from '@/modules/parser/type/type';

export class MethodLiteral extends Expression {
  module: string;
  name: string;

  constructor(module: string, name: string, type: Type, pos: Pos) {
    super(type, pos);
    this.module = module;
    this.name = name;
  }

  toString(): string {
    return `method literal "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  module: ${this.module}\n`);
    out.push(`${prefix}  name: ${this.name}\n`);
  }
}
