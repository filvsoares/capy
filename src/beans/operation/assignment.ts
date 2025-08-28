import { Pos } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { Operation } from '@/beans/expression/operation';
import { Type } from '@/beans/type/type';

export class Assignment extends Operation {
  target: Expression;

  constructor(operand: Expression, target: Expression, type: Type, pos: Pos) {
    super(operand, type, pos);
    this.target = target;
  }

  toString(): string {
    return 'assignment';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  target: `);
    this.target.debugPrint(out, `${prefix}  `);
  }
}
