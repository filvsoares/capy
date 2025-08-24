import { Pos } from '@/base';
import { L3Expression } from '@/beans/expression/l3-expression';
import { NUMBER } from '@/beans/type/l3-simple-type';

export class L3Number extends L3Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(NUMBER, pos);
    this.value = value;
  }

  get isReference(): boolean {
    return false;
  }

  toString(): string {
    return `number`;
  }
}
