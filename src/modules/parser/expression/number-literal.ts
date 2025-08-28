import { Pos } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { NUMBER } from '@/modules/parser/type/simple-type';

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
