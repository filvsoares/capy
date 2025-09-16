import { Pos } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { NUMBER } from '@/modules/type/simple-type';

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
