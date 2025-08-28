import { Pos } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { Operation } from '@/beans/expression/operation';
import { Type } from '@/beans/type/type';

export class StringConcat extends Operation {
  other: Expression;

  constructor(operand: Expression, other: Expression, type: Type, pos: Pos) {
    super(operand, type, pos);
    this.other = other;
  }

  toString(): string {
    return 'string concat';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  other: `);
    this.other.debugPrint(out, `${prefix}  `);
  }
}
