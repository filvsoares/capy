import { Pos } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { Operation } from '@/modules/expression/operation';
import { Type } from '@/modules/type/type';

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
