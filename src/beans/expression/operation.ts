import { Pos } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { Type } from '@/beans/type/type';

export abstract class Operation extends Expression {
  constructor(public operand: Expression, type: Type, pos: Pos) {
    super(type, pos);
  }
}
