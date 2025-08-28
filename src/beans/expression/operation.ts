import { Pos } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { Type } from '@/beans/type/type';

export abstract class Operation<OperandType extends Expression = Expression> extends Expression {
  constructor(public operand: OperandType, type: Type, pos: Pos) {
    super(type, pos);
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
  }
}
