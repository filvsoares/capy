import { Pos } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { NUMBER } from '@/beans/type/simple-type';

export class NumberLiteral extends Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(NUMBER, pos);
    this.value = value;
  }

  toString(): string {
    return `number`;
  }
}
