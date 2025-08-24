import { Pos } from '@/base';
import { L3Expression } from '@/beans/expression/l3-expression';
import { STRING } from '@/beans/type/l3-simple-type';

export class L3String extends L3Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(STRING, pos);
    this.value = value;
  }

  get isReference(): boolean {
    return false;
  }

  toString(): string {
    return `string`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}
