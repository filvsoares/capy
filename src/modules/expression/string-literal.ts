import { Pos } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { STRING } from '@/modules/type/simple-type';

export class StringLiteral extends Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(STRING, pos);
    this.value = value;
  }

  toString(): string {
    return `string`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}
